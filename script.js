// script.js
const { jsPDF } = window.jspdf;

function formatarDataHoje() {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function escreverParagrafo(doc, texto, margemEsquerda, posYRef, largura) {
  const linhas = doc.splitTextToSize(texto, largura);
  doc.text(linhas, margemEsquerda, posYRef.pos);
  posYRef.pos += linhas.length * 6 + 4;
  return posYRef;
}

function novaPaginaSeNecessario(doc, posYRef, margemInferior) {
  if (posYRef.pos > 277 - margemInferior) {
    doc.addPage();
    posYRef.pos = 20;
  }
  return posYRef;
}

document.getElementById("form-pdf").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const quadra = document.getElementById("quadra").value.trim();
  const lote = document.getElementById("lote").value.trim();
  const condominio = document.getElementById("condominio").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !quadra || !lote || !condominio || !cidade) {
    alert("Preencha todos os campos obrigatórios antes de gerar o PDF.");
    return;
  }

  const dataHojeBR = formatarDataHoje();
  const quadraUnidade = `Quadra ${quadra} / Unidade ${lote}`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margemEsquerda = 20;
  const larguraTexto = 170;
  const posYRef = { pos: 20 };

  // Título
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  const tituloLinhas = doc.splitTextToSize(
    "Solicitação de realização de assembleias condominiais em formato presencial e on-line",
    larguraTexto
  );
  doc.text(tituloLinhas, margemEsquerda, posYRef.pos);
  posYRef.pos += tituloLinhas.length * 6 + 10;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  // Prezada Senhora Síndica,
  doc.setFont("Helvetica", "bold");
  doc.text("Prezada Senhora Síndica,", margemEsquerda, posYRef.pos);
  posYRef.pos += 10;
  doc.setFont("Helvetica", "normal");

  const paragrafos = [
    "Na qualidade de condômino, sirvo-me do presente para solicitar que as futuras assembleias gerais passem a ser realizadas de forma híbrida, isto é, presencial e on-line, possibilitando a participação remota dos condôminos, bem como a realização de votações por meios eletrônicos.",
    "A presente solicitação encontra amparo na legislação vigente, especialmente no Código Civil, que em seu artigo 1.350 assegura a participação dos condôminos nas assembleias, bem como no artigo 1.354-A, introduzido pela Lei nº 14.309/2022, que autoriza expressamente a realização de assembleias e votações por meios eletrônicos, desde que garantida a identificação dos participantes, a segurança do voto e o direito de manifestação.",
    "Ressalta-se que a possibilidade de assembleias virtuais ou híbridas já vinha sendo admitida anteriormente pela Lei nº 14.010/2020, a qual, embora editada em caráter emergencial, consolidou entendimento posteriormente incorporado de forma definitiva ao ordenamento jurídico.",
    "No âmbito jurisprudencial, os tribunais pátrios vêm reconhecendo a validade das assembleias condominiais realizadas de forma virtual ou híbrida, desde que observados os princípios da transparência, da ampla participação e da preservação do direito de voto dos condôminos, entendendo que tais formatos favorecem a democracia condominial e ampliam a participação da coletividade, sobretudo em condomínios com elevado número de unidades.",
    "A adoção do formato híbrido mostra-se, portanto, medida razoável, legal e alinhada às boas práticas de gestão condominial, uma vez que contribui significativamente para o alcance do quórum necessário às deliberações, evitando a reiterada frustração de votações por ausência de maioria, além de promover maior inclusão e eficiência administrativa.",
    "Solicito ainda que, na hipótese de problemas de infraestrutura ou recursos que impeçam temporariamente a realização da videoconferência, a administração informe ao grupo oficial do condomínio (WhatsApp ou canal de comunicação oficial) as providências que estão sendo ou serão tomadas para viabilizar a modalidade híbrida com o caixa disponível atualmente, de forma a manter os condôminos cientes e permitir que a assembleia em formato presencial e on-line seja implementada assim que possível.",
    "Diante do exposto, solicito que essa administração avalie a implementação das assembleias em formato presencial e on-line, com a devida comunicação prévia aos condôminos e adequação dos meios tecnológicos necessários, em benefício da participação e do interesse coletivo.",
    "Certo de sua atenção e colaboração, coloco-me à disposição para eventuais esclarecimentos.",
  ];

  for (const p of paragrafos) {
    novaPaginaSeNecessario(doc, posYRef, 15);
    escreverParagrafo(doc, p, margemEsquerda, posYRef, larguraTexto);
  }

  // Atenciosamente,
  posYRef.pos += 4;
  novaPaginaSeNecessario(doc, posYRef, 40);
  doc.setFont("Helvetica", "bold");
  doc.text("Atenciosamente,", margemEsquerda, posYRef.pos);
  posYRef.pos += 14;

  doc.setFont("Helvetica", "normal");
  doc.text(nome, margemEsquerda, posYRef.pos);
  posYRef.pos += 6;
  doc.text(quadraUnidade, margemEsquerda, posYRef.pos);
  posYRef.pos += 6;
  doc.text(condominio, margemEsquerda, posYRef.pos);
  posYRef.pos += 6;
  if (telefone) {
    doc.text(telefone, margemEsquerda, posYRef.pos);
    posYRef.pos += 6;
  }

  posYRef.pos += 10;
  doc.setFontSize(10);
  doc.text(`${cidade}, ${dataHojeBR}`, margemEsquerda, posYRef.pos);
  posYRef.pos += 20;

  // Linha para assinatura
  const larguraLinha = 80;
  const xCentro = margemEsquerda + larguraLinha / 2;
  const xInicio = margemEsquerda;
  const xFim = margemEsquerda + larguraLinha;
  doc.line(xInicio, posYRef.pos, xFim, posYRef.pos);
  posYRef.pos += 6;
  doc.text("Assinatura do condômino", xCentro, posYRef.pos, { align: "center" });

  const nomeLimpo = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const arquivo = `solicitacao-assembleia-hibrida-${nomeLimpo || "condomino"}.pdf`;

  doc.save(arquivo);
});
