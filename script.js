let tarefas = [];

const formTarefa   = document.getElementById('form-tarefa');
const inputTarefa  = document.getElementById('input-tarefa');
const inputData    = document.getElementById('input-data');
const inputObs     = document.getElementById('input-observacao');
const listaTarefas = document.getElementById('lista-tarefas');

function renderizarTarefas() {
  listaTarefas.innerHTML = '';
  tarefas.forEach((tarefa, i) => {
    const li = document.createElement('li');
    if (tarefa.concluida) li.classList.add('concluida');

    const divInfo = document.createElement('div');
    divInfo.classList.add('tarefa-info');

    const spanTexto = document.createElement('span');
    spanTexto.textContent = tarefa.texto;
    divInfo.appendChild(spanTexto);

    const spanData = document.createElement('div');
    spanData.textContent = `Data: ${tarefa.data}`;
    spanData.classList.add('tarefa-data');
    divInfo.appendChild(spanData);

    // Se houver observação, mostra
    if (tarefa.observacao) {
      const spanObs = document.createElement('div');
      spanObs.textContent = tarefa.observacao;
      spanObs.classList.add('tarefa-observacao');
      divInfo.appendChild(spanObs);
    }

    li.appendChild(divInfo);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = tarefa.concluida;
    checkbox.addEventListener('change', () => {
      tarefas[i].concluida = checkbox.checked;
      renderizarTarefas();
    });
    li.appendChild(checkbox);

    listaTarefas.appendChild(li);
  });
}

formTarefa.addEventListener('submit', e => {
  e.preventDefault();
  const texto = inputTarefa.value.trim();
  const data  = inputData.value;
  const obs   = inputObs.value.trim();

  if (!texto || !data) {
    alert('Preencha descrição e data.');
    return;
  }

  tarefas.push({
    texto,
    data,
    observacao: obs || '',
    concluida: false
  });

  inputTarefa.value  = '';
  inputData.value    = '';
  inputObs.value     = '';

  renderizarTarefas();
});

document.getElementById('btn-whatsapp').addEventListener('click', async () => {
  const feitas   = tarefas.filter(t => t.concluida);
  const pendentes = tarefas.filter(t => !t.concluida);
  let msg = `*Checklist de Inspeção*\n\n`;

  if (feitas.length) {
    msg += `✅ *Realizadas:*\n`;
    feitas.forEach(t => {
      msg += `- ${t.texto} (Data: ${t.data})\n`;
      if (t.observacao) msg += `  ↳ ${t.observacao}\n`;
    });
    msg += `\n`;
  }

  if (pendentes.length) {
    msg += `⏳ *Pendentes:*\n`;
    pendentes.forEach(t => {
      msg += `- ${t.texto} (Data: ${t.data})\n`;
      if (t.observacao) msg += `  ↳ ${t.observacao}\n`;
    });
  }

  try {
    await navigator.clipboard.writeText(msg);
    alert('Checklist copiado! Agora cole no WhatsApp.');
  } catch {
    alert('Não foi possível copiar, copie manualmente:\n\n' + msg);
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    window.open('whatsapp://send', '_blank');
  } else {
    window.open('https://web.whatsapp.com/', '_blank');
  }
});

renderizarTarefas();
