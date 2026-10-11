# Music playlist

Seven songs are configured in `src/data/playlist.js`, in the order supplied by Manav. The repeated Sun Saawariya URL is included once. HTTPS links supplied directly are preserved; `s3://` locations are converted to encoded HTTPS playback URLs in region `ap-south-2`. The folder name remains exactly `MusicPortfoio`.

## Current access

All seven files passed anonymous checks on 11 October 2026: HEAD returned `200`, and a one-byte range request returned `206`. Responses have an MP3 content type and support byte ranges.

| Song | Artist / supplied credits |
| --- | --- |
| Saajna | Falak Shabir |
| Kooch Na Karin | Azhar Abbas |
| Nazm Nazm | Arko |
| Sahiba | Jasleen Royal · Stebin |
| Stay a Little Longer | Anushka Shahaney |
| Sun Saawariya | Accha Insaan · AtharvaMusic · Yaani Karnawat |
| Vaaroon Forever | Shreya Ghoshal · Romy |

Earlier checks returned `403 AccessDenied`. Both the `+` and `%20` forms of Nazm Nazm now succeed, so the current success is not attributable to changing space encoding. No AWS settings or credentials were changed or used by Codex. The old proposed access policy is no longer needed and has been removed from this note.

## Adding more songs

Provide the permanent HTTPS object URL or the exact S3 location. Preserve the object's spelling and capitalization. Add one entry with a short title, artist, and filename; use an explicit `url` when a direct HTTPS link is supplied. Temporary presigned URLs should not be saved as permanent playlist links because they expire.

Visitors press play to start listening; no autoplay or audio preload is requested. The player supports selection, next/previous, seeking, and continuation while its app window is closed or minimized. Optional local files stay on the visitor's device and are cleared on reload.

If playback later fails, check the exact object URL for anonymous access before changing AWS settings. Keep any future public read permissions limited to intended music objects; no AWS secret keys belong in the React app.
