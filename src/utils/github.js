import { Octokit } from '@octokit/rest'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO
const BRANCH = import.meta.env.VITE_GITHUB_BRANCH || 'main'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN

function getOctokit() {
  return new Octokit({ auth: TOKEN })
}

function decodeBase64Utf8(b64) {
  const binary = atob(b64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

async function getRecipes() {
  try {
    const octokit = getOctokit()
    const { data: files } = await octokit.repos.getContent({
      owner: OWNER, repo: REPO, path: 'recipes', ref: BRANCH
    })
    const recipes = await Promise.all(
      files
        .filter(f => f.name.endsWith('.json'))
        .map(async (file) => {
          const { data } = await octokit.repos.getContent({
            owner: OWNER, repo: REPO, path: file.path, ref: BRANCH
          })
          return JSON.parse(decodeBase64Utf8(data.content))
        })
    )
    return recipes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  } catch (e) {
    if (e.status === 404) return []
    throw e
  }
}

async function saveRecipe(recipe) {
  const octokit = getOctokit()
  const path = `recipes/${recipe.id}.json`
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(recipe, null, 2))))

  let sha
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER, repo: REPO, path, ref: BRANCH
    })
    sha = data.sha
  } catch (e) {
    if (e.status !== 404) throw e
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER, repo: REPO, path,
    message: sha ? `Mise à jour: ${recipe.title}` : `Ajout: ${recipe.title}`,
    content, branch: BRANCH,
    ...(sha ? { sha } : {})
  })
}

async function deleteRecipe(id) {
  const octokit = getOctokit()
  const path = `recipes/${id}.json`
  const { data } = await octokit.repos.getContent({
    owner: OWNER, repo: REPO, path, ref: BRANCH
  })
  await octokit.repos.deleteFile({
    owner: OWNER, repo: REPO, path,
    message: `Suppression recette: ${id}`,
    sha: data.sha, branch: BRANCH
  })
}

async function uploadImage(file, recipeId) {
  const octokit = getOctokit()
  const ext = file.name.split('.').pop()
  const path = `public/images/${recipeId}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  bytes.forEach(b => binary += String.fromCharCode(b))
  const content = btoa(binary)

  let sha
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER, repo: REPO, path, ref: BRANCH
    })
    sha = data.sha
  } catch (e) {
    if (e.status !== 404) throw e
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER, repo: REPO, path,
    message: `Photo: ${recipeId}`,
    content, branch: BRANCH,
    ...(sha ? { sha } : {})
  })

  return `https://${OWNER}.github.io/${REPO}/images/${recipeId}.${ext}`
}

export const githubService = { getRecipes, saveRecipe, deleteRecipe, uploadImage }
