export function getOrganelleType(id) {
  if (id.startsWith('mitochondria')) return 'mitochondria'
  if (id.startsWith('ribosome')) return 'ribosome'
  if (id.startsWith('lysosome')) return 'lysosome'
  return id
}
