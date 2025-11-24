// script.js
const { jsPDF } = window.jspdf;

// data fixa da assembleia
const DATA_ASSEMBLEIA_BR = "30/11/2025";

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

  if (!nome || !quadra || !lote || !condominio || !cidade) {
    alert("Preencha todos os campos antes de gerar o PDF.");
    return;
  }

  const dataAssembleiaBR = DATA_ASSEMBLEIA_BR;
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
    "– Deliberação sobre a participação dos condôminos " +
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

  const nomeLimpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const arquivo = `pauta-videoconferencia-${nomeLimpo || "condomino"}.pdf`;

  doc.save(arquivo);
});
