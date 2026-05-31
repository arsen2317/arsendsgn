const GITHUB_URL = 'https://github.com/arsen2317/arsendsgn/releases/download/3d/voxel.character.3d.model.glb';

export async function GET() {
  const res = await fetch(GITHUB_URL, { redirect: 'follow' });
  if (!res.ok) {
    return new Response('Model not found', { status: 404 });
  }
  const buffer = await res.arrayBuffer();
  return new Response(buffer, {
    headers: {
      'Content-Type': 'model/gltf-binary',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
