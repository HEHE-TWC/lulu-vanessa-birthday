# Homepage animation notes

## Assets
- Pop / landed (full body): `assets/lulu-fullbody.png` — sitting full figure, ears → feet visible; card below face
- Back Superman asset kept but unused: `assets/lulu-fly-back.png`
- Nav thumb: `assets/lulu-mascot.png`

## Path
Bottom → up bounce pop (~1.4s, spring overshoot), then settle center-bottom holding card

## Landed composition
- Full-body sitting silhouette (never cropped in half)
- Size capped with `object-fit: contain` (`--flyer-landed-size` / `--flyer-landed-h`)
- Card below face (no cover) · clickable → `inside.html`
- Pixel cursors on body / links

## Controls
- Replay: `#btn-replay` (“再彈一次”)
- Reduced motion: skip pop, show landed immediately

## Preview package
- Zip: `lulu-birthday-preview.zip`
- Guide: `PREVIEW.md`
- Local server: `python3 -m http.server 8765` → http://127.0.0.1:8765/
