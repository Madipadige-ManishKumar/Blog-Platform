// blog.js
function loadPosts(){ return JSON.parse(localStorage.getItem('mini-blog') || '[]'); }
function savePosts(posts){ localStorage.setItem('mini-blog', JSON.stringify(posts)); }

let posts = loadPosts();

function render(){
  const container = document.getElementById('posts'); container.innerHTML = '';
  posts.slice().reverse().forEach(p=>{
    const el = document.createElement('div'); el.className = 'post';
    el.innerHTML = `<h3>${p.title}</h3><div>${(p.content || '').slice(0,200)}${p.content.length>200?'...':''}</div>
      <div>Tags: ${p.tags.join(', ')}</div><button data-id="${p.id}" class="read btn">Read</button>`;
    container.appendChild(el);
  });
}

document.getElementById('publish').onclick = ()=>{
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const tags = document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!title || !content) return alert('Title and content required');
  posts.push({id:'p'+Date.now(), title, content, tags, created:Date.now()});
  savePosts(posts); render();
  document.getElementById('title').value=''; document.getElementById('content').value=''; document.getElementById('tags').value='';
};

document.addEventListener('click', e=>{
  if(e.target.matches('.read')){ const id = e.target.dataset.id; const p = posts.find(x=>x.id===id); alert(`Title: ${p.title}\n\n${p.content}`); }
});

// initial render
render();

// TODOs:
// - Add markdown rendering and preview toggle.
// - Implement edit/delete posts, slugs and hash-based routing for shareable URLs.
// - Add comments (local), image upload preview, drafts autosave.
// - Improve UI/UX with better styles and animations.
// - Implement search/filter by tags and content.
// - Add pagination for posts list.
