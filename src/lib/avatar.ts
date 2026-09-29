import fs from 'node:fs';
import path from 'node:path';

/** Put the (compressed) avatar in public/models/avatar.glb — it appears automatically on /results and on the home page. */
export const AVATAR_SRC = '/models/avatar.glb';
export const hasAvatar = fs.existsSync(path.join(process.cwd(), 'public', 'models', 'avatar.glb'));
