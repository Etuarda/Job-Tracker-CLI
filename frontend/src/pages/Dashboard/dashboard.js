import './dashboard.css';
import dashboardHtml from './dashboard.html?raw';
import { apiCreateApplication, apiDeleteApplication, apiListApplications, apiUpdateStatus } from '../../services/api.js';
import { requireAuth } from '../../state/session.js';

const VALID_STATUSES = ['Não Iniciado','Em Andamento','Aprovado','Reprovado'];

let applications = [];
let currentFilter = { search:'', status:'' };
let currentSort   = { by:'titulo', direction:'asc' };

function showToast(msg, isError=false){
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('show'), 2600);
}

const debounce = (fn, ms=200)=>{ 
  let id; 
  return (...a)=>{ 
    clearTimeout(id); 
    id = setTimeout(()=>fn(...a), ms); 
  }; 
};

function filterAndSearch(arr){
  const q = (currentFilter.search||'').toLowerCase();
  let out = arr;
  if (q) out = out.filter(a => (a.titulo+' '+a.empresa).toLowerCase().includes(q));
  if (currentFilter.status) out = out.filter(a => a.status===currentFilter.status);
  return out;
}

function sortApplications(arr){
  const { by, direction } = currentSort;
  const mul = direction==='asc' ? 1 : -1;
  return [...arr].sort((a,b)=>{
    const A = by==='status' ? VALID_STATUSES.indexOf(a.status) : (a[by]||'').toLowerCase();
    const B = by==='status' ? VALID_STATUSES.indexOf(b.status) : (b[by]||'').toLowerCase();
    if (A<B) return -1*mul; 
    if (A>B) return 1*mul; 
    return 0;
  });
}

function calculateKPIs(arr){
  const total = arr.length;
  const counts = Object.fromEntries(VALID_STATUSES.map(s=>[s,0]));
  arr.forEach(a=> counts[a.status]++);
  const pct = Object.fromEntries(VALID_STATUSES.map(s=>[
    s, total ? Math.round(counts[s]*100/total) : 0
  ]));
  return { total, counts, pct };
}

function renderKPIs(k){
  const kpiSection = document.getElementById('kpi-section');
  if (!kpiSection) return;

  kpiSection.innerHTML = `
    <div class="kpi-grid" style="display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:16px">
      <div class="card" style="padding:16px;border-radius:12px">
        <h3 style="font-size:14px;color:var(--muted);margin-bottom:6px">Total</h3>
        <div style="font-weight:800;font-size:22px">${k.total}</div>
      </div>
      ${VALID_STATUSES.map(s=>`
        <div class="card" style="padding:16px;border-radius:12px">
          <h3 style="font-size:14px;color:var(--muted);margin-bottom:6px">${s}</h3>
          <div style="font-weight:800;font-size:22px">${k.counts[s]} <span style="font-weight:600;font-size:14px;color:var(--accent-2)">(${k.pct[s]}%)</span></div>
        </div>
      `).join('')}
    </div>
  `;
}

function updateSortIcons(){
  document.querySelectorAll('.sortable').forEach(th=>{
    const sortBy = th.dataset.sortBy;
    const icon = th.querySelector('.sort-icon');
    th.classList.remove('sorted-asc','sorted-desc');
    if (icon) icon.textContent = '';
    if (currentSort.by===sortBy && icon){
      const asc = currentSort.direction==='asc';
      th.classList.add(`sorted-${currentSort.direction}`);
      icon.textContent = asc ? '▲' : '▼';
    }
  });
}

function renderTable(data){
  const tableBody = document.getElementById('application-table-body');
  const applicationTable = document.getElementById('application-table');
  const noApplicationsDiv = document.getElementById('no-applications');

  if (!tableBody || !applicationTable || !noApplicationsDiv) return;

  tableBody.innerHTML = '';
  const isFiltering = currentFilter.search || currentFilter.status;

  if (data.length===0){
    applicationTable.style.display = 'none';
    noApplicationsDiv.style.display = 'flex';
    noApplicationsDiv.querySelector('p').textContent = (applications.length && isFiltering)
      ? 'Nenhuma candidatura encontrada com os filtros atuais.'
      : 'Sem candidaturas ainda. Use o botão “+ Adicionar”.';
    updateSortIcons();
    return;
  }

  noApplicationsDiv.style.display = 'none';
  applicationTable.style.display = 'table';

  const frag = document.createDocumentFragment();
  data.forEach(app=>{
    const tr = document.createElement('tr');
    tr.dataset.id = app._id;

    tr.innerHTML = `
      <td data-label="Título">${app.titulo}</td>
      <td data-label="Empresa">${app.empresa}</td>
      <td data-label="Status">
        <span class="status-chip" data-status="${app.status}">
          <span class="status-dot" aria-hidden="true"></span>
          <span class="status-text">${app.status}</span>
        </span>
        <select class="status-select" data-id="${app._id}" aria-label="Alterar status de ${app.titulo}">
          ${VALID_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join('')}
        </select>
      </td>
      <td data-label="Ações">
        <button class="btn-delete" data-id="${app._id}" aria-label="Excluir candidatura de ${app.titulo}" type="button">Excluir</button>
      </td>
    `;

    tr.querySelector('.status-select').value = app.status;
    frag.appendChild(tr);
  });

  tableBody.appendChild(frag);
  updateSortIcons();
}

function openModal(initialFocusId='form-titulo'){
  const modal = document.getElementById('modal');
  modal?.classList.add('open');
  document.getElementById(initialFocusId)?.focus();
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal?.classList.remove('open');
  document.getElementById('application-form')?.reset();
}

async function loadAndRender(){
  applications = await apiListApplications();
  renderKPIs(calculateKPIs(applications));
  const filtered = filterAndSearch(applications);
  const sorted = sortApplications(filtered);
  renderTable(sorted);
}

export async function renderDashboard(mountId='main'){
  requireAuth();

  const el = document.getElementById(mountId);
  if (!el) return;
  el.innerHTML = dashboardHtml;

  const modal = document.getElementById('modal');
  const applicationForm = document.getElementById('application-form');
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('status-filter');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const addBtn = document.getElementById('add-btn');
  const applicationTable = document.getElementById('application-table');

  modal?.addEventListener('click', (e)=>{ if (e.target===modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && modal?.classList.contains('open')) closeModal(); });

  el.addEventListener('click', async (e)=>{
    const t = e.target;

    if (t?.id==='add-btn') openModal('form-titulo');
    if (t?.classList?.contains('close-btn') || t?.classList?.contains('modal-cancel-btn')) closeModal();

    if (t?.id==='clear-filters-btn'){
      searchInput.value=''; statusFilter.value='';
      currentFilter={search:'',status:''};
      renderTable(sortApplications(filterAndSearch(applications)));
    }

    if (t?.classList?.contains('btn-delete')){
      const id = t.dataset.id;
      if (confirm('Excluir esta candidatura?')){
        try{
          await apiDeleteApplication(id);
          showToast('Excluída.');
          await loadAndRender();
        }catch(err){
          showToast(err.message || 'Falha ao excluir.', true);
        }
      }
    }
  });

  applicationForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const titulo = document.getElementById('form-titulo').value;
    const empresa = document.getElementById('form-empresa').value;

    try{
      await apiCreateApplication({ titulo, empresa, status: 'Não Iniciado' });
      closeModal();
      showToast('Candidatura adicionada.');
      await loadAndRender();
    }catch(err){
      showToast(err.message || 'Falha ao salvar.', true);
    }
  });

  document.addEventListener('change', async (e)=>{
    const t = e.target;

    if (t===statusFilter){
      currentFilter.status = t.value;
      renderTable(sortApplications(filterAndSearch(applications)));
    }

    if (t?.classList?.contains('status-select')){
      const id = t.dataset.id;
      const val = t.value;
      try{
        await apiUpdateStatus(id, val);
        showToast(`Status: ${val}`);
        await loadAndRender();
      }catch(err){
        showToast(err.message || 'Falha ao atualizar status.', true);
      }
    }
  });

  searchInput?.addEventListener('input', debounce(()=>{
    currentFilter.search = searchInput.value;
    renderTable(sortApplications(filterAndSearch(applications)));
  }, 200));

  applicationTable?.querySelector('thead')?.addEventListener('click', (e)=>{
    const th = e.target.closest('.sortable');
    if (!th) return;
    const sortBy = th.dataset.sortBy;
    if (currentSort.by === sortBy) {
      currentSort.direction = currentSort.direction==='asc' ? 'desc' : 'asc';
    } else {
      currentSort.by = sortBy;
      currentSort.direction = 'asc';
    }
    renderTable(sortApplications(filterAndSearch(applications)));
  });

  await loadAndRender();
}
