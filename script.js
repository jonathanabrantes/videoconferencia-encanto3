// Configura o jsPDF vindo do CDN
const { jsPDF } = window.jspdf;

function formatarDataBrasileira(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarDataHoje() {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

document.getElementById("form-pdf").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const quadra = document.getElementById("quadra").value.trim();
  const lote = document.getElementById("lote").value.trim();
  const condominio = document.getElementById("condominio").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const dataAssembleia = document
    .getElementById("data-assembleia")
    .value.trim();

  if (!nome || !quadra || !lote || !condominio || !cidade || !dataAssembleia) {
    alert("Preencha todos os campos antes de gerar o PDF.");
    return;
  }

  const dataAssembleiaBR = formatarDataBrasileira(dataAssembleia);
  const dataHojeBR = formatarDataHoje();

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margemEsquerda = 20;
  let posY = 20;

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text(
    "Solicitação de inclusão de pauta em assembleia de condomínio",
    margemEsquerda,
    posY,
    { maxWidth: 170 }
  );

  posY += 12;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  const linhasIntro = [
    `Eu, ${nome}, condômino(a) do condomínio ${condominio},`,
    `quadra/bloco ${quadra}, lote/unidade ${lote}, venho por meio deste`,
    `documento solicitar formalmente a inclusão da seguinte pauta na ordem`,
    `do dia da assembleia a realizar-se em ${dataAssembleiaBR}.`,
  ].join(" ");

  const textoPauta =
    "– Deliberação sobre a possibilidade de participação dos condôminos " +
    "por chamada de vídeo (videoconferência) nas assembleias do condomínio.";

  const textoFinal =
    "Solicito que esta pauta conste de forma expressa na convocação e " +
    "seja submetida à apreciação e votação dos condôminos presentes.";

  const introQuebrado = doc.splitTextToSize(linhasIntro, 170);
  doc.text(introQuebrado, margemEsquerda, posY);
  posY += introQuebrado.length * 6 + 6;

  const pautaQuebrado = doc.splitTextToSize(textoPauta, 170);
  doc.setFont("Helvetica", "bold");
  doc.text("Pauta a ser incluída:", margemEsquerda, posY);
  posY += 7;
  doc.setFont("Helvetica", "normal");
  doc.text(pautaQuebrado, margemEsquerda + 4, posY);
  posY += pautaQuebrado.length * 6 + 8;

  const finalQuebrado = doc.splitTextToSize(textoFinal, 170);
  doc.text(finalQuebrado, margemEsquerda, posY);
  posY += finalQuebrado.length * 6 + 16;

  doc.text(`${cidade}, ${dataHojeBR}`, margemEsquerda, posY);
  posY += 25;

  // Linha para assinatura
  const larguraLinha = 80;
  const xCentro = margemEsquerda + larguraLinha / 2;
  const xInicio = margemEsquerda;
  const xFim = margemEsquerda + larguraLinha;

  doc.line(xInicio, posY, xFim, posY);
  posY += 6;

  doc.setFontSize(10);
  doc.text("Assinatura do condômino", xCentro, posY, { align: "center" });

  // Nome do arquivo
  const nomeLimpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const arquivo = `pauta-videoconferencia-${nomeLimpo || "condomino"}.pdf`;

  doc.save(arquivo);
});
