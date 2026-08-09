/* @meta
{
  "name": "doubao/last-response",
  "description": "豆包最新回复 (doubao last-response: get the most recent AI response on current page)",
  "domain": "www.doubao.com",
  "args": {},
  "readOnly": true,
  "example": "bb-browser site doubao/last-response"
}
*/
async function(args) {
  // 2026-08: doubao web switched from markdown-body to md-box-root for AI answer containers.
  // User messages share md-box-root; filter them out (user bubbles are right-aligned: justify-end ancestor).
  const isUserMsg = (el) => {
    let cur = el.parentElement;
    for (let i = 0; i < 8 && cur; i++) {
      if (typeof cur.className === 'string' && cur.className.includes('justify-end')) return true;
      cur = cur.parentElement;
    }
    return false;
  };
  const mds = Array.from(document.querySelectorAll('[class*="markdown-body"], [class*="md-box-root"]')).filter(md => !isUserMsg(md));
  if (mds.length === 0) return { message: '', hint: '当前页面没有AI回复' };

  const text = mds[mds.length - 1]?.innerText?.trim() || '';
  const imgs = Array.from(mds[mds.length - 1]?.querySelectorAll('img') || [])
    .map(i => i.src).filter(s => s && !s.includes('emoji'));
  const convId = location.pathname.match(/\/chat\/([^/?#]+)/)?.[1] || '';

  return Object.assign({ message: text, conversation_id: convId, response_index: mds.length }, imgs.length ? { images: imgs } : {});
}
