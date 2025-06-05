import { Injectable } from '@nestjs/common';
import { FormData } from '../interface/form-data';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Injectable()
export class AttachmentService {
  async execute(formData: FormData) {
    const salario = parseFloat(formData?.ultimoSalario || '0');
    const valorPorFora = parseFloat(formData?.valorPorFora || '0');
    const salarioSubstituicao = parseFloat(formData?.salarioSubstituido || '0');
    const valorDevidoTransporte = parseFloat(
      formData?.valorDevidoTransporte || '0',
    );
    const valorRecebidoTransporte = parseFloat(
      formData?.valorRecebidoTransporte || '0',
    );
    const total = salario + valorPorFora;
    const htmlContent = `
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; font-size: 14px; color: #333; }
    h1, h2, h3 { text-align: center; }
    h1 { font-size: 20px; }
    h2 { font-size: 18px; margin-top: 30px; }
    h3 { font-size: 16px; margin-top: 20px; }
    p { line-height: 1.6; text-align: justify; }
    .section { margin-top: 20px; }
    .bold { font-weight: bold; }
    ul { margin-left: 20px; }
  </style>
</head>
<body>

<h1>EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DA VARA DO TRABALHO DE ${(formData.cidade ?? 'CIDADE NÃO INFORMADA').toUpperCase()}/UF</h1>

<p>
  ${formData.nomeReclamada ?? 'NOME NÃO INFORMADO'},
  ${formData.nacionalidadeReclamada ?? 'NACIONALIDADE NÃO INFORMADA'},
  ${formData.estadoCivilReclamada ?? 'ESTADO CIVIL NÃO INFORMADO'}, portador(a) do RG nº ${formData.rgReclamada ?? 'RG NÃO INFORMADO'} SSP/${formData.ufReclamada ?? 'UF NÃO INFORMADA'}, inscrito(a) no CPF sob o nº 
  ${formData.cpfReclamada ?? 'CPF NÃO INFORMADO'} e no PIS sob o nº ${formData.pisReclamada ?? 'PIS NÃO INFORMADO'}, portador(a) da CTPS nº ${formData.ctpsNumeroReclamada ?? 'CTPS NÃO INFORMADO'}, 
  série ${formData.ctpsSerieReclamada ?? 'SERIE NÃO INFORMADA'}, filho(a) de ${formData.nomeMaeReclamada ?? 'MÁE NÃO INFORMADA'}, nascido(a) aos ${formData.dataNascimentoReclamada ?? 'DATA NÃO INFORMADA'}, 
  residente à ${formData.enderecoReclamada ?? 'ENDERECO NÃO INFORMADO'}, 
  ${formData.bairroReclamada ?? 'BAIRRO NÃO INFORMADO'} - ${formData.cidadeReclamada ?? 'CIDADE NÃO INFORMADA'}/${formData.ufReclamada ?? 'UF NÃO INFORMADA'} (CEP ${formData.cepReclamada ?? 'CEP NÃO INFORMADO'}), com contato eletrônico 
  para recebimento de notificações através do e-mail ${formData.emailReclamada ?? 'E-MAIL NÃO INFORMADO'}, vem, através de sua advogada abaixo assinada, à presença de V. Exa., propor:
</p>

<h2> RECLAMAÇÃO TRABALHISTA</h2>

<p>
  ${(formData.reclamadas ?? [])
    .map(
      (rec, index) => `
        ${index !== 0 ? `${index + 1}ª` : `a ser processada pelo RITO ORDINÁRIO, em face de`}  
        <span class="bold">${rec.nome}</span>, pessoa jurídica de direito privado e/ou público, devidamente inscrita no CNPJ sob o nº ${rec.cnpj}, estabelecida na ${rec.endereco}, ${rec.bairro} - ${rec.cidade}/${rec.uf} (CEP ${rec.cep}), com endereço eletrônico através do e-mail: ${rec.email} e telefone ${rec.telefone}, 
        ${index === 0 ? `e subsidiariamente` : formData.reclamadas && formData.reclamadas.length === index + 1 ? `pelos motivos de fato e de direito adiante expendidos:` : ``}
      `,
    )
    .join('<br>')}
</p>


<h2>DOS FATOS
DO CONTRATO DE TRABALHO
</h2>
<h3>
Início do tópico - geral${formData.modalidadeDispensa === `Outros` ? `("Verificar modalidade da dispensa - ${formData.modalidadeDispensa}")` : ``}:
</h3>
<p>
  
A parte reclamante foi contratada em <span class="bold">${formData?.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}</span>, exercendo por último a função de <span class="bold">${formData.cargoCtps && formData.cargoCtps.toUpperCase()}</span>, sob a remuneração de <span class="bold">R$ ${formData.ultimoSalario} </span> por mês, 
acrescido de <span class="bold">${formData.adicionais && formData.adicionais.map((adc) => adc.toUpperCase()).join('/')}</span>, sendo que o contrato foi encerrado sem justa causa em <span class="bold">${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}</span>. 
</p>
<p>Em razão do cargo, competia a parte autora as seguintes atribuições ${formData.atividadesDesempenhadas}.</p>

<h2>VARIAÇÕES</h2>
${
  formData.trabalhouSemRegistroCTPS === 'Sim'
    ? `
  <h2>SEM REGISTRO</h2>
<p>
A parte reclamante foi admitida em <span class="bold">${format(formData.dataAdmissaoSemRegistro, 'dd/MM/yyyy', { locale: ptBR })}</span>, sem registro em sua CTPS, exercendo por último a função de <span class="bold">${formData.cargoCtps && formData.cargoCtps.toUpperCase()}</span>, sob a remuneração de R$ ${formData.ultimoSalario} por mês, sendo que o contrato foi encerrado sem justa causa em <span class="bold">${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}</span>.
</p>
`
    : ``
}
${
  formData.trabalhouSemRegistroCTPS === 'Apenas um período'
    ? `
  <h2>COM PERÍODO SEM REGISTRO </h2>
<p>
A parte reclamante foi admitida em <span class="bold">${formData?.dataAdmissaoSemRegistro && format(formData.dataAdmissaoSemRegistro, 'dd/MM/yyyy', { locale: ptBR })}</span>, apenas tendo sido registrada na CTPS em <span class="bold">${formData.dataRegistro && format(formData.dataRegistro, 'dd/MM/yyyy', { locale: ptBR })}</span>, exercendo por último a função de ${formData.cargoCtps && formData.cargoCtps.toUpperCase()}, sob a remuneração de R$ ${formData?.ultimoSalario} por mês, acrescido de 30% do adicional de periculosidade e produção, sendo que o contrato foi encerrado sem justa causa em <span class="bold">${formData?.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}</span>.
</p>
`
    : ``
}

${
  formData.modalidadeDispensa === 'Sem justa causa' &&
  formData.avisoPrevio === 'Indenizado'
    ? `
<p>
  <h2>SEM JUSTA CAUSA – AVISO PRÉVIO INDENIZADO</h2>
O contrato de trabalho se encerrou mediante dispensa, sem justa causa, pelo empregador em ${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}, com aviso prévio indenizado ${formData.anotacaoCtpsAvisoPrevio === 'Sim' ? `, projetando seu contrato de trabalho até <span class="bold">${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy', { locale: ptBR })}, nos termos da Lei 12.506/2011</span>` : ``}.
</p>
  `
    : formData.modalidadeDispensa === 'Sem justa causa' &&
        formData.avisoPrevio === 'Trabalhado'
      ? `<h2>SEM JUSTA CAUSA – AVISO PRÉVIO TRABALHADO</h2>
<p>
O contrato de trabalho se encerrou mediante dispensa, sem justa causa, em ${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })} ${
          formData.anotacaoCtpsAvisoPrevio === 'Sim'
            ? `, com aviso prévio trabalhado até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy', { locale: ptBR })} e, projeção do aviso prévio indenizado até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy', { locale: ptBR })}, nos termos da Lei 12.506/2011.
</p>
`
            : ``
        }.`
      : ``
}
<p>
${
  formData.avisoPrevio === 'Trabalhado'
    ? `<h2>TRABALHANDO (sem aviso prévio e multa 40% do FGTS)</h2>
Ressalte-se que o contrato de trabalho permanece vigente, razão pela qual pugna-se pelo recebimento de todas as verbas pleiteadas e seus reflexos, sejam elas vencidas e/ou vincendas.
`
    : ``
}
</p>

${
  formData.modalidadeDispensa === 'Pedido de Demissão' &&
  formData.avisoPrevio === 'Não cumpriu'
    ? `
  <h2>PEDIDO DE DEMISSÃO – AVISO PRÉVIO NÃO CUMPRIDO</h2>
  <p>
    O contrato de trabalho se encerrou mediante pedido de demissão pelo empregado aos ${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}, não tendo cumprido o aviso prévio.
  </p>`
    : ''
}
${
  formData.modalidadeDispensa === 'Pedido de Demissão' &&
  formData.avisoPrevio === 'Trabalhado'
    ? `
  <h2>PEDIDO DE DEMISSÃO – AVISO PRÉVIO CUMPRIDO</h2>
  <p>
    O contrato de trabalho se encerrou mediante pedido de demissão pelo empregado aos ${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}, tendo cumprido o aviso prévio de forma trabalhada até ${formData.dataDispensa && format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy')}.
  </p>`
    : ''
}
${
  formData.modalidadeDispensa === 'Justa Causa'
    ? `
  <h2>JUSTA CAUSA</h2>
  <p>
    O contrato de trabalho foi extinto mediante demissão por justa causa em ${formData.dataDispensa && format(formData.dataDispensa, 'dd/MM/yyyy', { locale: ptBR })}, sob a alegação de <span class="bold">${formData.motivoJustaCausa || 'FALTA ATRIBUTO_MOTIVO_JUSTA_CAUSA'}</span>.
    ${formData.advertenciaJustaCausa === 'Sim' ? 'Importante destacar que o reclamante recebeu advertências prévias.' : ''}
  </p>`
    : ''
}

<h2>SEM JUSTA CAUSA – RETIFICAÇÃO DA CTPS</h2>
  <p>
      A parte reclamante foi admitida em ${formData.dataAdmissaoSemRegistro && format(formData.dataAdmissaoSemRegistro, 'dd/MM/yyyy', { locale: ptBR })}, tendo sido registrado na função de ${formData.cargoCtps}, porém, efetivamente, exercia as atribuições de ${formData.cargoDesempenhado} desde [00/00/0000], sendo que a empregadora não procedeu a alteração tempestiva da CTPS e/ou o remunerou corretamente.
  </p>

<h2>DOIS CONTRATOS DE TRABALHO(NÃO_IDENTIFICADO - FORMULÁRIO)</h2>
<p>
A parte reclamante foi contratada pela empregadora em dois períodos, sendo estes:
1º contrato: de 00/00/0000 a 00/00/0000, exercendo as funções de [inserir] quando recebia o salário de R$ 00,00 mensais, acrescido de [inserir], sendo que o contrato foi encerrado mediante [dispensa sem justa causa/dispensa por justa causa/pedido de demissão].
2º contrato: de 00/00/0000 a 00/00/0000, exercendo as funções de [inserir] quando recebia o salário de R$ 00,00 mensais, acrescido de [inserir], sendo que o contrato foi encerrado mediante [dispensa sem justa causa/dispensa por justa causa/pedido de demissão].
</p>

<h2>Final do tópico - fixo:</h2>
  <p>
    Por fim, acresça-se que a parte autora teve como último local de trabalho ${formData.enderecoUltimoTrabalho}, em prol da [preenchimento manual, para caso de terceirização], sendo este o Fórum Trabalhista o competente para processar o presente feito
  </p>

<h2 class="section">DOS FUNDAMENTOS JURÍDICOS</h2>

<h3>RESPONSABILIDADE DAS RECLAMADAS</h3>
${
  formData.temMaisReclamadas === 'Sim' &&
  formData.tipoResposabilidadeEmpresas === 'Subsidiária (terceirizado)'
    ? `
  <h3>RESPONSABILIDADE SUBSIDIÁRIA – terceirização</h3>
<p>
Embora o reclamante tenha sido contratado pela primeira reclamada, durante todo o pacto laboral sempre desempenhou suas funções em benefício da segunda reclamada que, na forma da Súmula 331, do C.TST, deverá responder <span class="bold">SUBSIDIARIAMENTE</span> pelos créditos trabalhistas deferidos na presente demanda.
</p>`
    : ``
}

${
  formData.temMaisReclamadas === 'Sim' &&
  formData.tipoResposabilidadeEmpresas === 'Solidária (mesmo grupo econômico)'
    ? `
    <h3>RESPONSABILIDADE SOLIDÁRIA – grupo econômico</h3>
    <p>
    As empresas reclamadas integram o mesmo grupo econômico, motivo pelo qual, com fundamento no artigo 2º, parágrafo 2º, da CLT, devem responder <span class="bold">solidariamente</span> pelos direitos que vierem a ser reconhecidos na presente demanda.
    </p>`
    : ``
}
${
  formData.temMaisReclamadas === 'Sim' &&
  formData.tipoResposabilidadeEmpresas === 'Outros'
    ? `
    <h3>RESPONSABILIDADE SOLIDÁRIA – subempreita(Verificar a responsabilidade - Outros)</h3>
<p>
A primeira reclamada é empreiteira da segunda reclamada, razão pela qual, com fundamento no artigo 455 da CLT, devem responder solidariamente pelos direitos que vierem a ser reconhecidos na presente demanda. Todavia, caso esse não seja o entendimento desse Juízo, a segunda reclamada deverá responder <span class="bold">subsidiariamente</span> pelos créditos trabalhistas deferidos ao reclamante na presente demanda, nos termos da Súmula 331, IV do C. TST.
</p>

<h3>RESPONSABILIDADE SOLIDÁRIA – sucessão</h3>
<p>
A primeira reclamada é sucessora da segunda reclamada, razão pela qual, com fundamento nos artigos 10 e 448 da CLT, deverão ambas reclamadas responder solidariamente pelos direitos que vierem a ser reconhecidos na presente demanda.
</p>


<h3>RESPONSABILIDADE SOLIDÁRIA – contrato temporário</h3>

<h4>CONTRATO LÍCITO</h4>
<p>
O reclamante foi contratado sob o regime de trabalho temporário, motivo pelo qual, na forma da lei 6.019/74, as reclamadas devem responder solidariamente pelos direitos que vierem a ser reconhecidos na presente demanda.
</p>

<h4>OU</h4>

<h4>CONTRATO TEMPORÁRIO NULO</h4>
<p>
As reclamadas simularam a contratação do reclamante como contrato temporário. Tendo participado voluntariamente da fraude, a empresa de trabalho temporário deverá responder solidariamente pelos direitos que vierem a ser reconhecidos na presente demanda, tal como estabelece a lei, inclusive para os contratos regulares.
</p>

<h3>RESPONSABILIDADE SOLIDÁRIA – cooperativa de trabalho</h3>
<p>
As reclamadas simularam a contratação do reclamante como cooperado. Tendo participado voluntariamente da fraude, a cooperativa deverá responder solidariamente pelos direitos que vierem a ser reconhecidos na presente demanda. Caso não seja este o entendimento de Vossa Excelência, e houver reconhecimento de vínculo de emprego diretamente com a cooperativa, primeira reclamada, na forma da Súmula 331 do C.TST, a segunda reclamada deverá responder subsidiariamente pelos créditos trabalhistas deferidos na presente demanda.
</p>
`
    : ``
}


<h2 class="section">DAS NULIDADES</h2>
${
  formData.trabalhouSemRegistroCTPS === 'Sim' &&
  formData.seguroDesempregoSemRegistro === 'Não'
    ? `<h3>DA RELAÇÃO DE EMPREGO – RECONHECIMENTO DE VÍNCULO EMPREGATÍCIO - VERBAS SALARIAIS E RESCISÓRIAS</h3>
<p>
Conforme narrado ao tópico do contrato de trabalho, a parte autora prestou serviços sem que houvesse a regularização da sua CTPS, trabalhando sem registro no período de <span class="bold">[puxar dados do contrato]</span>.
</p>
<p>
Ocorre que o reclamante sempre prestou serviços para a empresa, em caráter contínuo e não eventual (havia escala e horário a ser cumpridos), respondia aos superiores (hierarquia), era remunerado (onerosidade) e não podia se fazer substituir por outrém (pessoalidade).
</p>
<p>
Presentes, portanto, os requisitos da pessoalidade, subordinação, não-eventualidade e onerosidade, conforme dispõem os arts. 2º e 3º da CLT, devendo ser reconhecido o vínculo empregatício no mencionado lapso temporal.
</p>

<p>
Logo, pugna pela procedência total da ação e declaração do vínculo empregatício do período sem registro de <span class="bold">[01/09/2020 a 28/02/2021]</span>, com a correspondente anotação em CTPS, a qual é imprescritível.
</p>

<p>
Ainda, considerando a rescisão contratual firmada em <span class="bold">[desligamento]</span>, sem a correta consideração do período sem registro, deverá a Reclamada ser condenada ao pagamento das diferenças das verbas rescisórias, a saber:
<span class="bold">saldo de salário, aviso prévio, férias vencidas e/ou proporcionais + 1/3, 13º salários de [inserir anos a receber], FGTS do período laborado, inclusive sobre as verbas rescisórias acima pleiteadas, acrescido da multa fundiária de 40%, e Recolhimentos Previdenciários ao INSS</span>.
</p>

<p>
Protesta pela compensação de valores comprovadamente quitados sob idêntico título, bem como a anotação da correta data de início e baixa na CTPS autoral, referente ao período contratual pleiteado.
</p>

<h3>PEDIDOS DEPENDENTES</h3>
<p>
Seja reconhecido o vínculo com a empregadora no período de <span class="bold">[período do contrato]</span>, com salário mensal de <span class="bold">[salário - dados do contrato]</span>, bem como anotação na CTPS do obreiro na função de <span class="bold">[função - dados do contrato]</span>, sob pena de multa a ser estipulada por este MM. Juiz, a qual é imprescritível.
</p>

<p>
A entrega das Guias TRCT com o código 01 para percepção do FGTS depositado, e caso a Reclamada não venha cumprir com esta obrigação, requer a expedição de Alvará judicial, bem como entrega das Guias do Seguro-desemprego (CD), ou em caso de impossibilidade do recebimento deste último, seja condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
</p>

<table border="1" cellspacing="0" cellpadding="6" width="100%">
  <tbody>
    <tr>
      <td colspan="2" style="font-weight: bold; background-color: #f0f0f0;">VERBAS RESCISÓRIAS:</td>
      <td style="text-align: right; font-weight: bold; background-color: #f0f0f0;"">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Saldo de salário</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso Prévio indenizado (${formData.avisoPrevio === 'Indenizado' ? '30 dias' : '___ dias'})</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">13º Salário proporcional</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Férias proporcionais + 1/3</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">FGTS + 40%</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
`
    : ``
}

${
  formData.acordoEmpresa === 'Sim'
    ? `<h3>DA NULIDADE DO “ACORDO” FORMULADO NA COMISSÃO DE CONCILIAÇÃO PRÉVIA</h3>

<p>
Após a dispensa, no ato da homologação da rescisão contratual, a Reclamada se comprometeu a proceder o pagamento R$ ${formData.acordoEmpresa === 'Sim' && formData.valorAcordo ? formData.valorAcordo : ``}. 
</p>

<p>
Para tanto, o obreiro seria convocado para comparecimento perante a Comissão de Conciliação Prévia, para realização de um “acordo”. 
</p>
<p>
Ocorre que, no caso em tela não há que se falar na existência de um “acordo” justo ou, quiçá razoável para o trabalhador (hipossuficiente), haja vista que, ao assinar um termo de acordo de quitação de direitos, sem ter o conhecimento técnico (lesão), com a pressão psicológica e promessa de recontratação por parte da empresa (coação), acabou por firmar “acordo” em valores totalmente desproporcionais e irrisórios frente ao que lhe caberia. 
</p>
<p>
A atitude adotada pela Reclamada e aqui aventada, não se trata de um mero caso isolado e, sim, de evidente estratégia empresarial, eis que esta vem reiteradas vezes se utilizando deste subterfugio, no intuito de dar quitação às verbas decorrentes dos contratos de trabalho firmados com seus empregados, deixando de cumprir com as obrigações contratuais trabalhistas de forma proposital, no intuito de obter vantagem financeira quando da assinatura do acordo junto à CCP. 
</p>
<p>
Ora Excelência, a empresa ora 1ª Reclamada está a obter vantagens indevidas ao deixar de remunerar mensalmente as horas extras praticadas e a produção pactuada com o trabalhador, na certeza de que poderá receber quitação do contrato de trabalho quando convocar o ex-funcionário para firmar o indigitado acordo! 
</p>

<p>
É tão nítida a manobra empresarial/financeira criada pela 1ª Reclamada que, no ato da convocação para comparecer à Comissão de Conciliação Prévia (CCP), o trabalhador recebe uma carta onde figura como <span class="bold">“Demandante”</span>, quando na verdade é o <span class="bold">“Demandado”</span>.
</p>

<p>
Outrossim, ao chegar no dia e local da convocação, ao trabalhador não lhe é facultado negociar valores, tampouco definir quais as verbas ali englobadas e, ainda, como forma de coagir o obreiro — que se encontra desempregado — o representante da reclamada lhe promete a possibilidade de <span class="bold">recontratação após 6 (seis) meses</span>, caso assine o acordo.
</p>

<p>
Desse modo, resta caracterizada a intenção da reclamada de se locupletar às custas do trabalho alheio, beneficiando-se da mão de obra de funcionários, cuja jornada de trabalho é demasiadamente extensa, fazendo-os trabalhar em regime de horas extras, na certeza de que não terá que os remunerar de acordo com o que a Lei determina.
</p>

<h2 class="section">DA LESÃO</h2>

<p>
O Código Civil de 2002 consagrou de forma expressa o <span class="bold">Princípio da Boa-Fé</span> como fundamento de qualquer negócio jurídico (art. 113 do Código Civil), censurando com nulidade o contrato que o contrarie. 
</p>

<p>
Sabe-se que a declaração de vontade é requisito de existência do negócio jurídico. Para que este seja <span class="bold">válido</span>, todavia, é necessário que a vontade seja manifestada <span class="bold">livre e espontaneamente</span>.
</p>

<p>
Por outro lado, havendo defeito ou imperfeições na formação da vontade ou na sua declaração, o negócio jurídico é <span class="bold">anulável</span>. Dentre os defeitos do negócio jurídico que o tornam anulável, o Código Civil menciona e regula a <span class="bold">lesão</span>.
</p>

<p>
Lesão é o negócio defeituoso em que não se observa o princípio da igualdade, ou ao menos a proporcionalidade, entre a prestação e a contraprestação. Revelando a <span class="bold">falta de equidade</span> ou <span class="bold">iniquidade enorme</span>, provoca um desequilíbrio nas relações contratuais, segundo o jurista Arnaldo Rizzardo.
</p>

<p>
O conceituado autor civilista, Carlos Roberto Gonçalves, define a lesão como sendo o prejuízo resultante da enorme desproporção existente entre as prestações de um contrato, no momento de sua celebração, determinada pela <span class="bold">premente necessidade</span> ou <span class="bold">inexperiência</span> de uma das partes.
</p>

<p>
Discorre, ainda, Carlos Roberto Gonçalves que, na lesão, a parte tem noção da desproporção de valores, mas realiza o negócio mesmo assim, premido pela necessidade patrimonial.
</p>

<p>
De fundo moral, a figura da lesão visa ajustar o contrato a seus devidos termos e reprimir a exploração usuária de um contratante por outro, protegendo exclusivamente o <span class="bold">lesado</span>, como fez o novo Código Civil brasileiro. Dispõe o art. 157 do novo diploma:
</p>

<blockquote>
“<em>Art. 157. Ocorre a lesão quando uma pessoa, sob premente necessidade, ou por inexperiência, se obriga a prestação manifestamente desproporcional ao valor da prestação oposta.</em>”
</blockquote>

<p>
No presente caso, após a rescisão do contrato de trabalho, ao reclamante foi proposto pela primeira reclamada um “acordo extrajudicial”, cujo valor <span class="bold">não guarda qualquer proporção</span> entre o devido e o efetivamente recebido pelo obreiro.
</p>

<p>
Outrossim, apenas foi informado ao obreiro que lhe seria pago um valor para reembolsá-lo de descontos indevidos, produção e horas extras do último mês do contrato de trabalho, sem contudo, ter sido esclarecido o que lhe estava sendo exatamente pago, nem tampouco quais eram os efeitos daquela “avença”. Ao contrário, apenas lhe foi apresentado um valor já previamente determinado e, para que lhe fosse paga a mencionada quantia, obrigatoriamente deveria assinar alguns documentos, consistentes num “acordo” proposto, cujo respectivo valor não guarda qualquer proporção entre o valor devido e o recebido pelo obreiro. 
</p>

<p>
Essa transação foi feita perante a Comissão de Conciliação Prévia, não com o intuito de se apurar e negociar verbas controversas, mas sim para que a primeira obtivesse a quitação plena do extinto contrato de trabalho do reclamante. 
</p>

<p>
Repetindo, o valor aproximado de R$ ${formData.valorAcordo ? formData.valorAcordo : `[repercutir valor do acordo]`} pago pela primeira reclamada nesse negócio jurídico é IRRISÓRIO e ÍNFIMO frente ao valor que o reclamante faz jus, causando uma ruptura do equilíbrio contratual. Ademais, vale ressaltar a inexperiência do obreiro, pois não tinha conhecimentos técnicos ou habilidades relativas à natureza da transação. 
</p>


<p>
Portanto, levando-se em conta que a manifestação de vontade do reclamante não era <span class="bold">LIVRE</span> no momento da realização daquela transação, o acordo extrajudicial firmado entre o reclamante e a primeira reclamada deve ser <span class="bold">ANULADO</span>, em razão da <span class="bold">lesão</span>, nos termos do art. 171, II do Código Civil.
</p>

<h2 class="section">DA COAÇÃO</h2>

<p>
Como dito, após a dispensa, a Reclamada se comprometeu a proceder o pagamento da produção e das horas extras dos últimos meses devidas ao obreiro, condicionando, entretanto, o pagamento ao comparecimento do Reclamante perante a Comissão de Conciliação Prévia, para realização de um “acordo”.
</p>

<p>
Naquela oportunidade, com um valor já previamente determinado, sem possibilidade de negociação, foi informado que lhe seria pago um valor para reembolsá-lo de descontos indevidos e horas extras relativas ao último mês de trabalho. No entanto, para que lhe fosse paga a mencionada quantia, obrigatoriamente deveria assinar alguns documentos, consistentes num “acordo” proposto, cujo respectivo valor não guarda qualquer proporção entre o valor devido e o recebido pelo obreiro, eis que recebera o ínfimo valor aproximado de <span class="bold">R$ ${formData.valorAcordo ? formData.valorAcordo : `[repercutir valor do acordo]`}</span>.
</p>

<p>
Ademais, como dito, naquela oportunidade, o preposto da 1ª Reclamada lançou mão de uma “promessa de recontratação” ao obreiro, que seria concretizada após 6 (seis) meses da rescisão, contudo, caso o Reclamante não concordasse em assinar o acordo naquele momento, disse que não teria como cumprir a “promessa”.
</p>

<p>
Com esse procedimento, nítido ter havido pressão por parte da primeira reclamada para que o ex-funcionário firmasse o indigitado “acordo”.
</p>

<p>
Ao comparecer no local determinado, o reclamante não teve a oportunidade de negociar valores com a reclamada, mas tão somente receber o que lhe era ofertado. Em face da coação promovida, o reclamante sentiu-se obrigado a fazer o acordo e, com isso, deu quitação ao extinto contrato de trabalho.
</p>

<p>
Ressalte-se que, em nenhum momento, o reclamante teve a oportunidade de discutir valores ou fazer contraproposta, estando limitado a aceitar o valor que lhe foi imposto pela primeira reclamada.
</p>

<h2 class="section">DA SIMULAÇÃO</h2>

<p>
Outrossim, não houve nenhum tipo de prestação de assistência jurídica ao reclamante e, importante ressaltar, que não partiu do obreiro a iniciativa de procurar a Comissão de Conciliação Prévia, eis que foi convocado pela empresa.
</p>

<p>
Corroborando com tais fatos, cita-se o depoimento do representante do sindicato, em caso análogo, contra a mesma empresa (Processo nº 011059-44.2019.5.15.0044 – AUTOR: VALTER CASTRO DE ANDRADE – RÉU: TEL TELECOMUNICAÇÕES LTDA.), colhido como testemunha da reclamada, Sr. Ismar José Antônio Júnior, REPRESENTANTE SINDICAL:
</p>

<blockquote>
“que acredita que estava presente no dia do acordo realizado na CCP; ...que não se lembra se o reclamante negociou valor, nem o nome do conciliador da empresa; que é costumeiro o pessoal do sindicato contactar o funcionário para comparecer na CCP, não sabendo precisar o nome da pessoa que contactou o reclamante. Nada mais”
</blockquote>

<p>
Pede vênia para citar trecho do v. acórdão proferido nos autos do processo acima citado:
</p>

<blockquote>
VALIDADE DO ACORDO PERANTE A CCP. Quanto à validade do acordo realizado perante a CCP, o julgador de origem assim decidiu:
<br><br>
“Depreende-se dos depoimentos supratranscritos que não houve efetiva assistência sindical ao empregado por ocasião da demanda submetida à CCP, já que nem mesmo o membro da CCP, representante dos empregados, presente no dia da conciliação, soube informar se houve efetiva negociação entre as partes.
<br><br>
Além disso, ao contrário do que evidenciam os documentos de fls. 224/225, a submissão da demanda à Comissão de Conciliação Prévia não foi provocada pelo reclamante, pois o próprio representante do sindicato declarou que "é costumeiro o pessoal do sindicato contactar o funcionário para comparecer na CCP, não sabendo precisar o nome da pessoa que contactou o reclamante".
<br><br>
Por todo o exposto, considerando a simulação de demanda perante a CCP, já que não houve provocação pelo reclamante, não houve efetiva negociação entre as partes, tampouco foi prestada a devida assistência sindical, reconheço a nulidade do termo de conciliação firmado perante a CCP, nos termos do art. 9º da CLT, ficando autorizada, contudo, a dedução dos valores pagos sob os mesmos títulos em razão do acordo firmado. Acolhe-se.”
</blockquote>

<p>
A forma de conciliação em destaque é constitucional e, por propiciar a disseminação de formas alternativas de resolução de conflitos, merece ser prestigiada. Mas, no caso específico dos autos, não se verifica o cumprimento dos requisitos indispensáveis para sua validade.
</p>

<p>
Como bem exposto na r. decisão, a testemunha do autor, que também passou pela comissão de conciliação, deixou claro que não houve negociação quanto ao valor acordado em seu caso, não havendo assistência jurídica, tampouco orientação adequada, confirmando a ausência de real negociação.
</p>

<p>
No mesmo sentido, podemos citar outro acórdão do E. TRT da 15ª Região:
</p>

<blockquote>
“DO ACORDO PERANTE A CCP. A reclamada argumenta que é válido o acordo firmado perante a CCP. Pois bem. Ficou claro em audiência que a reclamada de fato coagia os empregados a aceitarem o acordo. A primeira testemunha ouvida, no contexto do recebimento das verbas rescisórias, disse que ‘tinha conhecimento [do] “cala boca” oferecido pela reclamada, mas não recebeu’. Ou seja, a reclamada induzia os empregados a aceitarem o acordo referente à rescisão.
<br><br>
E ainda que assim não fosse, fato é que o termo de conciliação CCP (fl. 187) apresenta salário complessivo, uma vez que não discrimina a quê exatamente o valor de R$ 2.500,00 se refere — se às horas extras propriamente ditas, se ao intervalo intrajornada, se ao intervalo interjornada, se aos reflexos. Portanto, realmente, tal como decidido pelo d. Juízo de origem, é nula a conciliação nesse ponto, ficando, porém, a reclamada autorizada a descontar o valor pago do que eventualmente se verificar devido.”
<br><br>
(TRT 15ª – RO nº 0013166-07.2016.5.15.0096, Rel. Gerson Lacerda Pistori)
</blockquote>


<p>
Portanto, deve ser considerada <span class="bold">NULA</span> a quitação total do contrato de trabalho na Comissão de Conciliação Prévia, em face da <span class="bold">LESÃO, COAÇÃO E SIMULAÇÃO</span> praticadas pela primeira reclamada, conforme disposto nos artigos <span class="bold">9º da CLT</span> e <span class="bold">167 e 171 do Código Civil</span>.
</p>

<h3 class="section">PEDIDO CORRELATO</h3>

<p>
Seja, assim, declarada <span class="bold">NULA</span> a quitação do contrato de trabalho dada na Comissão de Conciliação Prévia, nos termos dos artigos <span class="bold">9º da CLT</span> e <span class="bold">171, II do Código Civil</span>.
</p>
`
    : ``
}

${
  formData.modalidadeDispensa === 'Outros' &&
  formData.teveAnotacaoCtps === 'Não'
    ? `<h3>NULIDADE DE CONTRATO TEMPORÁRIO / NULIDADE DO CONTRATO POR PRAZO DETERMINADO</h3>

<p>
Embora tenha sido pactuado contrato por prazo determinado/temporário, é certo a empregadora não observou os requisitos de lei, vez que trata-se de uma modalidade de contrato especial que necessita da comprovação da transitoriedade que deu origem a contratação e/ou contrato de experiência. 
</p>

<p>
Tais requisitos encontram-se fixados no art. 443 da CLT, <i>in verbis</i>: 
</p>

<p>
<i>Art. 443.  O contrato individual de trabalho poderá ser acordado tácita ou expressamente, verbalmente ou por escrito, por prazo determinado ou indeterminado, ou para prestação de trabalho intermitente. (Redação dada pela Lei nº 13.467, de 2017)</i>
</p>

<p>
<i>
<u>
§ 1º - Considera-se como de prazo determinado o contrato de trabalho cuja vigência dependa de termo prefixado ou da execução de serviços especificados ou ainda da realização de certo acontecimento suscetível de previsão aproximada.
§ 2º - O contrato por prazo determinado só será válido em se tratando:
a) de serviço cuja natureza ou transitoriedade justifique a predeterminação do prazo;
b) de atividades empresariais de caráter transitório; 
c) de contrato de experiência.
</u>
</i>
</p>

<p>
Ocorre que não há documentos que comprovem que a modalidade de contratação atende aos requisitos de lei. Neste sentido, uma vez evidenciada a irregularidade na modalidade de contratação, necessário se faz a declaração da nulidade do contrato por prazo determinado e sua conversão para contrato indeterminado, conforme prevê a jurisprudência, in verbis:
</p>

<p>
CONTRATO POR PRAZO DETERMINADO. CLT, ART. 443. REQUISITOS. O contrato por prazo determinado é contrato de trabalho especial, que só pode ser firmado em caso de serviço cuja natureza ou transitoriedade justifique a predeterminação do prazo e de atividades empresariais de caráter transitório e de contrato de experiência. Hipótese em que os requisitos legais dessa modalidade de contrato não foram atendidos. Invalidade. Recurso Ordinário das rés a que se nega provimento.(TRT-12 - ROT: 00012314920205120019, Relator: HELIO BASTIDA LOPES, 1ª Câmara)
</p>

<p>
CONTRATO DE EXPERIÊNCIA. AUSÊNCIA DE FORMALIZAÇÃO POR CONTRATO ESCRITO OU ANOTAÇÃO EM CTPS. PRESUNÇÃO DE AJUSTE POR PRAZO INDETERMINADO. O contrato de experiência, modalidade de contrato por prazo determinado, constitui-se espécie excepcional de contrato, pelo que é cogente sua formalização mediante contrato por escrito ou, no mínimo, que seja realizado o registro de tal condição na CTPS do empregado (artigos 29 e 443 da CLT). Em razão da ausência de tal formalização, presume-se que o ajuste se deu por prazo indeterminado. (TRT-18 - RORSum: 00100329320235180014, Relator: CESAR SILVEIRA, 3ª TURMA)
</p>

<p>
Por consequência, com a declaração da nulidade do contrato por prazo determinado e sua conversão para indeterminado, requer a condenação da reclamada ao pagamento das verbas decorrentes da dispensa injusta em contrato por prazo indeterminado, consistentes em aviso prévio e seus reflexos em 13º salário, férias + 1/3 e FGTS e multa de 40%, inclusive sobre a integralidade dos depósitos.
</p>
`
    : ``
}
${
  formData.modalidadeDispensa === 'Outros' &&
  formData.outroTipoDispensa === 'Contrato por cooperativa'
    ? `
<h3>COOPERATIVA FRAUDULENTA</h3>

<p>
A parte autora foi contratada pela segunda reclamada através da primeira reclamada (uma cooperativa de trabalho) de forma fraudulenta, eis que não se encontram presentes os requisitos configuradores da atividade cooperada, uma vez que não participava de assembleias nem deliberava sobre a administração da entidade.
</p>

<p>
Trata-se de mecanismo utilizado para mascarar a relação de emprego, razão pela qual deverá ser declarada a nulidade do ato cooperado e o vínculo empregatício deverá ser reconhecido diretamente com a segunda reclamada, tomadora dos serviços destinados ao cumprimento de sua atividade fim, condenando-se a promover o registro do contrato de trabalho na CTPS, em prazo e sob as penas a serem cominadas por V. Exa. Na omissão, requer que seja autorizada a Secretaria da Vara a realizá-lo. 
</p>

<p>
Caso V. Exa. não vislumbre o contrato de trabalho formado diretamente com a empresa tomadora, requer-se seja reconhecido o vínculo de emprego diretamente com a cooperativa, primeira reclamada, condenando-se a promover o registro do contrato de trabalho na CTPS, em prazo e sob as penas a serem cominadas por V. Exa. Na omissão, requer que seja autorizada a Secretaria da Vara a realizá-lo. 
</p>

<p>
De toda forma, pugna-se pela condenação das reclamadas ao pagamento das verbas trabalhistas do contrato de trabalho, a saber: aviso prévio, 13ºs salários, férias + 1/3 e FGTS+40%. 
</p>

<p>
Os valores cobrados a título de adesão ao falso sistema de cooperativa deverão ser restituídos.
condicoes
</p>
`
    : ``
}
${
  formData?.condicoes?.length && formData.condicoes.includes('Gestante')
    ? `
<h3>NULIDADE DA DISPENSA – EMPREGADA GRÁVIDA</h3>
<p>
A reclamante foi dispensada quando se encontrava grávida, conforme documentação em anexo, motivo pelo qual, diante do disposto no artigo 10, II, letra “b” do ADCT, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração da obreira, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável ou indevida a reintegração (Súmula 244, do C.TST), seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}

${
  formData?.condicoes?.length &&
  formData.condicoes.includes(
    'Dentro do período de estabilidade do acidente/doença? (12 meses após a alta médica)',
  )
    ? `
<h3>NULIDADE DA DISPENSA – EMPREGADO ACIDENTADO</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que sofreu acidente de trabalho/foi acometido por doença profissional, tendo recebido alta em [xx/xx/xx], motivo pelo qual, diante do disposto no artigo 118 da Lei 8.213/91 (cuja constitucionalidade já foi reconhecida na Súmula 378, do C.TST), deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>

<h3>NULIDADE DA DISPENSA – DOENTE</h3>
<p>
Por ocasião da dispensa, o reclamante encontrava-se enfermo e, portanto, deveria estar em gozo de auxílio doença com seu contrato de trabalho suspenso. Desta forma, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período entre o desligamento e a recuperação da capacidade laborativa, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}
${
  formData?.condicoes?.length && formData.condicoes.includes('Cipeiro')
    ? `
<h3>NULIDADE DA DISPENSA – CIPEIRO</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que foi eleito, em [xx/xx/xx], para desempenhar mandato na CIPA. Assim, diante do disposto no artigo 165, da CLT e da Súmula 339, do C.TST, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}
${
  formData?.condicoes?.length &&
  formData.condicoes.includes('Dirigente sindical')
    ? `
<h3>NULIDADE DA DISPENSA – DIRIGENTE SINDICAL</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que foi eleito, em [xx/xx/xx], para desempenhar as funções de [xxx] no sindicato [xxxx]. Assim, diante do disposto no artigo 543, parágrafo 3º, da CLT, deve ser declarada a nulidade do ato de dispensa, que não observou o disposto na Súmula 379, do C.TST, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}
${
  formData.avisoPrevio === 'Outros' &&
  formData.outraFormaAvisoPrevio ===
    'Trabalhado - Sem alternativa de redução da jornada'
    ? `
<h3>NULIDADE DO AVISO PRÉVIO </h3>
<p>
O instituto do aviso prévio tem por objetivo assegurar ao trabalhador a oportunidade de obter nova colocação no mercado de trabalho (de tal forma este direito é reconhecido, que motivou a edição das Súmulas 230 e 276, do C.TST). No caso em tela, não foi oportunizado ao reclamante a possibilidade de optar pela redução de jornada diária em 2 horas ou dispensa por 7 dias consecutivos nem permitiu que dispusesse do tempo estabelecido pelo artigo 488, da CLT.
</p>
  `
    : ``
}
${
  formData?.condicoes?.length &&
  formData.condicoes.includes(
    'Dentro do período de estabilidade do acidente/doença? (12 meses após a alta médica)',
  )
    ? `
<h3>SE A CONCESSÃO SE DEU DENTRO DO PERÍODO ESTABILITÁRIO</h3>
<p>
O aviso prévio concedido na vigência do período estabilitário, pelo que deve ser declarado nulo, na forma da Súmula 349, do C.TST.
</p>
<p>
Nulo o aviso prévio concedido, faz jus a indenização de novo período de aviso prévio, pagando-lhe, ainda, 1/12 de 13º salário proporcional e 1/12 de férias proporcionais + 1/3, além do FGTS + 40% sobre o aviso prévio indenizado e sobre o 13º salário.
</p>
  `
    : ``
}
${
  formData.modalidadeDispensa === 'Pedido de Demissão' &&
  formData.nulidadePedido === 'Sim'
    ? `
<h3>DA NULIDADE DA JUSTA CAUSA APLICADA</h3>
<p>
A parte autora foi desligada por justa causa, com fundamento generalizado no artigo 482 da CLT. Contudo, não houve qualquer fato considerado grave para aplicabilidade da penalidade imposta, não podendo prevalecer a mesma. 
</p>
<p>
Tratando-se a justa causa de medida extrema e considerando os efeitos decorrentes de sua aplicação na vida profissional e até mesmo pessoal do trabalhador, para a caracterização da falta grave a ensejá-la exige-se a produção de sólidos elementos de prova, a cargo do empregador que a invoca.
</p>
<p>
Ademais, caso houvesse a existência de algum fato que fosse considerado falta grave, a reclamada não observou a imediatidade na aplicação da punição (do contrário, configura perdão tácito), o passado funcional do empregado, a proporcionalidade entre a postura do reclamante e a natureza da punição, tampouco a gradação pedagógica no exercício do seu poder disciplinar.
</p>
<p>
Na presente situação a Reclamada sumariamente dispensou o Reclamante, por ato que não justifica e legítima a aplicação da dispensa por justa causa, onde a pena capital prevista na CLT descabe no caso em foco, sob pena de configurar flagrante injustiça, devendo ser relegada a hipótese de indelével gravidade que lesem o empregador, material ou moralmente, o que não foi o caso conforme restará provado em sede de audiência de instrução.
</p>
<p>
Desta forma demonstra-se que não houve ato justificador da aplicação da dispensa por justa causa, assim, houve arbitrariedade e abuso por parte da Reclamada em dispensar por justa causa o Reclamante.
</p>
<p>
Diante destes fatos, o Reclamante não concorda com sua dispensa por justa causa, razão pela qual requer a NULIDADE DA JUSTA CAUSA IMPOSTA, convolando-se a rescisão contratual na modalidade DEMISSÃO IMOTIVADA, bem como, a Reclamada seja condenada no pagamento das seguintes verbas rescisórias e direitos trabalhistas da Reclamante: saldo de salário, aviso prévio indenizado, 13º salário proporcional, férias proporcionais + 1/3, FGTS + 40% sobre as verbas rescisórias e Multa de 40% do FGTS pela dispensa sem justa causa.
</p>
<p>
Requer ainda, a entrega das Guias TRCT com o código 01 para percepção do FGTS depositado, e caso a Reclamada não venha cumprir com esta obrigação, requer a Reclamante expedição de Alvará judicial, bem como entrega das Guias do Seguro-desemprego (CD), ou em caso de impossibilidade do recebimento deste último, seja condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
</p>
<p>
Deverão ser deduzidos os valores pagos sob mesmo título.
</p>
<h3>
PEDIDOS CONDICIONADOS A ESSA FUNDAMENTAÇÃO: 
</h3>
<p>
A NULIDADE DA JUSTA CAUSA IMPOSTA, convolando-se a rescisão contratual na modalidade DEMISSÃO IMOTIVADA, com  consequente condenação da Reclamada ao pagamento das verbas rescisórias e direitos trabalhistas inerentes da dispensa sem justa causa, tais quais: saldo de salário, Aviso Prévio indenizado, 13º salário proporcional, férias proporcionais + 1/3, FGTS sobre as verbas rescisórias + 40%, Multa de 40% do FGTS.
</p>
<p>
A entrega das Guias/TRCT com o código 01 para percepção do FGTS depositado e entrega das Guias do Seguro-desemprego (CD) e, caso a Reclamada não venha cumprir com esta obrigação, requer-se a expedição de Alvará judicial, bem como em caso de impossibilidade do recebimento deste último, que seja a ré condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
</p>
<p>
Deverão ser deduzidos os valores pagos sob mesmo título.
</p>
<table border="1" cellspacing="0" cellpadding="6" width="100%">
  <tbody>
    <tr>
      <td colspan="2" style="font-weight: bold; background-color: #f0f0f0;">
        VERBAS DA REVERSÃO DA JUSTA CAUSA:
      </td>
      <td style="text-align: right; font-weight: bold; background-color: #f0f0f0;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso Prévio indenizado (${formData.avisoPrevio === 'Indenizado' ? '30 dias' : '___ dias'})</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">13º Salário proporcional</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Férias proporcionais + 1/3</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso prévio indenizado</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">FGTS + 40%</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
${
  formData.modalidadeDispensa === 'Justa Causa' &&
  formData.nulidadePedido === 'Sim'
    ? `
<h3>DO DANO MORAL REVERSÃO JUSTA CAUSA - "para análise do advogado"</h3>
    <p>
    A injusta conduta da empregadora ao imputar ao reclamante a prática de ato desabonador, com a consequente aplicação da penalidade da justa causa, privando-o de imediato de seu sustento, sem qualquer pagamento de verbas rescisórias e sem lhe permitir o saque de FGTS ou o ingresso no programa de seguro-desemprego impôs-lhe ver-se privado das condições que asseguram seu sustento e de sua família, humilhando-o em seu íntimo.
    </p>
    <p>
    Assim, não apenas foi vítima de acusação infundada, como viu-se privado do trabalho que lhe permitia garantir a sobrevivência. O sofrimento moral do trabalhador, nesta hipótese, é facilmente constatável.
    </p>
    <p>
A Constituição da República, em seu artigo 5º, incisos V e X, assegura a reparação integral do dano moral sofrido, motivo pelo qual requer seja a reclamada condenada a reparar o reclamante pelo sofrimento experimentado, em valor a ser arbitrado por Vossa Excelência, sugerindo o montante de 20 (vinte) vezes a remuneração do obreiro.
    </p>
    `
    : ``
}
${
  formData.modalidadeDispensa === 'Pedido de Demissão' &&
  formData.nulidadePedido === 'Sim'
    ? `
<h3>DA NULIDADE DO PEDIDO DE DEMISSÃO</h3>
    <p>
Embora tenha pedido seu desligamento perante a empregadora, a parte autora pugna pela sua nulidade, eis que somente o fez em razão [inserir vício de consentimento – ameaça, abuso, erro, afins].
    </p>
    <p>
Neste sentido, evidente o vício no ato praticado pela parte autora, segue entendimento da jurisprudência sob o tema: 
    </p>
    <p>
PEDIDO DE DEMISSÃO. NULIDADE. VÍCIO DE CONSENTIMENTO. CONFIGURADO. Caracterizado o vício de vontade, por culpa da reclamada, no pedido de demissão supostamente formulado livremente pelo obreiro, nos termos do art. 9º da CLT, é devida a declaração de nulidade do ato, com o consequente pagamento das parcelas referentes à modalidade de dispensa por interesse do empregador. Recurso provido. (TRT-1 - RO: 01001134120215010561 RJ, Relator: JOSÉ LUIS CAMPOS XAVIER, Data de Julgamento: 09/02/2022, Quinta Turma, Data de Publicação: 09/03/2022)
    </p>
    <p>
    Ressalte-se que, além das provas anexadas à presente exordial, a autora pretende comprovar suas alegações através de suas testemunhas, que acompanharam o tratamento desproporcionais que ensejaram o pedido de demissão.
    </p>
    <p>
Sendo assim, seja pela coação imposta, seja pela ausência de requisito legal para a validade do pedido ora impugnado, requer-se a declaração da nulidade do pedido de demissão, com consequentemente reconhecimento da dispensa sem justa causa e condenação da ré ao pagamento das verbas rescisórias: saldo de salário, aviso prévio indenizado, 13º salário proporcional, férias proporcionais + 1/3, depositar na sua conta vinculada os valores do FGTS de todo o período, acrescido da indenização de 40%, bem como os recolhimentos Previdenciários ao INSS e multas dispostas nos artigos 467 e 477 da CLT. 
    </p>
    <p>
Protesta pela compensação de valores comprovadamente quitados sob idêntico título, bem como a anotação baixa na CTPS autoral.
    </p>
    <h3>
    PEDIDOS CONDICIONADOS A ESSA FUNDAMENTAÇÃO: 
    </h3>
    <p>
A NULIDADE DO PEDIDO DE DEMISSÃO, convolando-se a rescisão contratual na modalidade DEMISSÃO IMOTIVADA, com  consequente condenação da Reclamada ao pagamento das verbas rescisórias e direitos trabalhistas inerentes da dispensa sem justa causa, tais quais: saldo de salário, Aviso Prévio indenizado, 13º salário proporcional, férias proporcionais + 1/3, FGTS sobre as verbas rescisórias + 40%, Multa de 40% do FGTS.
    </p>
    <p>
    A entrega das Guias/TRCT com o código 01 para percepção do FGTS depositado e entrega das Guias do Seguro-desemprego (CD) e, caso a Reclamada não venha cumprir com esta obrigação, requer-se a expedição de Alvará judicial, bem como em caso de impossibilidade do recebimento deste último, que seja a ré condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
    </p>
    <table border="1" cellspacing="0" cellpadding="6" width="100%">
  <tbody>
    <tr>
      <td colspan="2" style="font-weight: bold; background-color: #f0f0f0;">
        VERBAS DA REVERSÃO DA JUSTA CAUSA:
      </td>
      <td style="text-align: right; font-weight: bold; background-color: #f0f0f0;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso Prévio indenizado (${formData.avisoPrevio === 'Indenizado' ? '30 dias' : '___ dias'})</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">13º Salário proporcional</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Férias proporcionais + 1/3</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso prévio indenizado</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">FGTS + 40%</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
    `
    : ``
}

${
  formData.modalidadeDispensa === 'Rescisão Indireta'
    ? `
<h3>RESCISÃO INDIRETA DO CONTRATO DE TRABALHO</h3>
    <p>
Conforme tópico anterior, não obstante a relação de emprego permaneça vigente, esta não pode mais perdurar em razão das violações praticadas pela Reclamada, quais sejam:
    </p>
    <p>
      -${formData.motivoRescisaoIndireta}<br>
    </p>
    <p>
Tais condutas são práticas recorrentes na reclamada, em total afronta aos direitos da reclamante, o que dá ensejo a Rescisão Indireta do contrato de trabalho, conforme o disposto no art. 483, alíneas [inserir], da CLT:
    </p>
    <p>
Art. 483 - O empregado poderá considerar rescindido o contrato e pleitear a devida indenização quando:
a) forem exigidos serviços superiores às suas forças, defesos por lei, contrários aos bons costumes, ou alheios ao contrato;
b) for tratado pelo empregador ou por seus superiores hierárquicos com rigor excessivo;
c) correr perigo manifesto de mal considerável;
d) não cumprir o empregador as obrigações do contrato;
e) praticar o empregador ou seus prepostos, contra ele ou pessoas de sua família, ato lesivo da honra e boa fama;
f) o empregador ou seus prepostos ofenderem-no fisicamente, salvo em caso de legítima defesa, própria ou de outrem;
    </p>
    <p>
Diante das faltas graves da Reclamada, torna-se o contrato de trabalho insustentável, devendo assim ser declarada a rescisão indireta do contrato, fundamentado no art. 483, nas alíneas [inserir], da CLT. E por estes motivos, que a trabalhadora se socorre ao judiciário, com o fim de não ser prejudicada pelo empregador que não quer mais tê-lo como funcionária.
    </p>
    <p>
Assim, diante das constantes irregularidades e violação aos parâmetros contratuais firmados na contratação, além das omissões da ré quanto ao cumprimento das suas obrigações como empregadora, já legitima e autoriza a Reclamante a pleitear a rescisão indireta de seu contrato de trabalho.
    </p>
    <p>
Com a declaração da rescisão indireta do contrato de trabalho da Reclamante, requer a condenação da Reclamada ao pagamento das seguintes verbas vencidas e vincendas: saldo de salário, aviso prévio, 13º salário proporcional; férias proporcionais + 1/3 e FGTS + 40% sobre as rescisórias e multa de 40% sobre o FGTS de todo o período. Deverão ser deduzidos os valores comprovadamente quitados sob o mesmo título.
    </p>
    <p>
Seja a Reclamada condenada a proceder a baixa da CTPS com data a ser designada por este Douto Juízo, uma vez que o contrato de trabalho até a presente data está vigente.
    </p>
    <p>
Uma vez sendo decretada a rescisão indireta do contrato de trabalho conforme requerido, requer-se a condenação da Reclamada a entregar à Reclamante o TRCT com o código 01 e as guias do FGTS e Seguro Desemprego (CD), ou em caso de impossibilidade do recebimento deste último, seja condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
    </p>
    <h3>Protesta por parcelas vencidas e vincendas.</h3>
    <p>
PEDIDOS CONDICIONADOS A ESSA FUNDAMENTAÇÃO: 
Em virtude do contrato de trabalho estar em vigor, pugna pelo recebimento de todas as verbas pleiteadas e seus reflexos, sejam elas vencidas e/ou vincendas.
    </p>
    <p>
    Seja declarada a rescisão indireta do contrato de trabalho, nos termos do art. 483 da CLT, com  consequente condenação da ré ao pagamento das verbas rescisórias e direitos trabalhistas inerentes da dispensa sem justa causa, tais quais: saldo de salário, Aviso Prévio indenizado, 13º salário proporcional, férias proporcionais + 1/3, FGTS sobre as verbas rescisórias + 40%, Multa de 40% do FGTS.
    </p>
    <p>
A entrega das Guias/TRCT com o código 01 para percepção do FGTS depositado e entrega das Guias do Seguro-desemprego (CD) e, caso a Reclamada não venha cumprir com esta obrigação, requer-se a expedição de Alvará judicial, bem como em caso de impossibilidade do recebimento deste último, que seja a ré condenada na sua indenização pelo valor equivalente, nos termos do art. 186 do Código Civil.
    </p>
    <table border="1" cellspacing="0" cellpadding="6" width="100%">
  <tbody>
    <tr>
      <td colspan="2" style="font-weight: bold; background-color: #f0f0f0;">
        VERBAS DA REVERSÃO DA JUSTA CAUSA:
      </td>
      <td style="text-align: right; font-weight: bold; background-color: #f0f0f0;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso Prévio indenizado (${formData.avisoPrevio === 'Indenizado' ? '30 dias' : '___ dias'})</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">13º Salário proporcional</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Férias proporcionais + 1/3</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">Aviso prévio indenizado</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2">FGTS + 40%</td>
      <td style="text-align: right;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
    `
    : ``
}
${
  formData.adicionais && formData.adicionais.length > 0
    ? `
<h3>Dos acréscimos na remuneração ${formData.adicionais.map((adicional) => adicional).join('/')}</h3>
  ${
    formData.adicionais.includes('Insalubridade')
      ? `
    <h3>DO ADICIONAL DE INSALUBRIDADE</h3>
    <p>
    A parte autora no exercício das atividades de ${formData.atividadesDesempenhadas ? formData.atividadesDesempenhadas : '[inserir]'}, mantinha contato contínuo e diário com ${formData.riscoInsalubridade ? formData.riscoInsalubridade : '[inserir os produtos ou condições insalubres do contrato de trabalho]'}. 
    </p>
    <p>
    Desta forma, a parte autora ficava exposta de forma habitual e permanente, não ocasional, nem intermitente ao agente insalubre e, mesmo tendo conhecimento dessas condições agressivas de trabalho, a reclamada nunca lhe pagou corretamente o adicional de insalubridade. 
    </p>
    <p>
    Cabia à reclamada, tomar todas as medidas que conduzem à diminuição ou eliminação da nocividade das atividades do reclamante, dentre as quais as relativas ao fornecimento adequado dos equipamentos de proteção individual, bem como a fiscalização do seu uso (Súmula 289 do C. TST), o que não ocorreu.
    </p>
    <p>
    A Constituição Federal, em seu artigo 7º, inciso XXIII, trata especificamente do tema garantindo ao trabalhador “adicional de remuneração para as atividades penosas, insalubres ou perigosas, na forma da lei;”. 
    </p>
    <p>
    Assim, depreende-se que o autor tem o direito de receber o adicional de insalubridade, em grau máximo, durante todo o pacto laboral, bem como seus reflexos no aviso prévio, 13ºs salários; férias (+1/3) e FGTS+40%. 
    </p>
    <p>
    Requer ainda, seja determinada a realização de perícia técnica de insalubridade. Requer ainda, seja cumprido o disposto no artigo 431-A do CPC que determina ao Juízo que designe dia, hora e lugar em que terá início a diligência; 
    </p>
    <p>
    Finalmente, requer a condenação da reclamada na obrigação de fazer, consistente na entrega do documento denominado PERFIL PROFISSIOGRÁFICO PREVIDENCIÁRIO – PPP e do LAUDO TÉCNICO DE CONDIÇÕES AMBIENTAIS DE TRABALHO – LTCA, sob pena de multa e astreintes, bem como que proceda a anotação na CTPS do obreiro do período em que laborou nesta atividade (insalubre), em conformidade com o art. 29 da CLT.
    </p>
  `
      : ``
  }
${
  formData.adicionais.includes('Periculosidade')
    ? `
    <h3>DO ADICIONAL DE PERICULOSIDADE</h3>
    <p>
     No desempenho de suas funções, o Reclamante permanecia exposto de forma diária e contínua a agentes de risco inerentes a função, vez que ${formData.descricaoAtividadesInsalubridade ? formData.descricaoAtividadesInsalubridade : '[descrever a função de risco]'}. 
    </p>
    <p>
[campo para inserir fundamentação e jurisprudência, se for o caso]. 
    </p>
    <p>
Desta forma, a parte autora ficava exposta de forma habitual e permanente, não ocasional e, mesmo tendo conhecimento dessas condições agressivas de trabalho, a reclamada nunca lhe pagou o adicional de periculosidade. 
    </p>
    <p>
Cabia à reclamada, tomar todas as medidas que conduzem à diminuição ou eliminação da nocividade das atividades do reclamante, dentre as quais as relativas ao fornecimento adequado dos equipamentos de proteção individual, bem como a fiscalização do seu uso (Súmula 289 do C. TST), o que não ocorreu.
    </p>
    `
    : ``
}
    `
    : ``
}
${
  formData.trabalhouOutroEstado === 'Sim' &&
  formData.recebeuAdicionalTransferencia === 'Não'
    ? `
    <h3>ADICIONAL DE TRANSFERÊNCIA</h3>
    <p>
No período de ${formData.tempoTransferencia ? formData.tempoTransferencia : '[inserir]'}, a parte autora foi transferida provisoriamente para atuar ${formData.cidadeTransferencia ? formData.cidadeTransferencia : '[inserir local]'}, oportunidade que laborava nas mesmas funções e jornada de trabalho.
    </p>
    <p>
Em que pese a empregadora subsidiar todos os custos necessários (moradia, água, luz, alimentação), durante o respectivo período a ré não quitou os valores a título de adicional de transferência, conforme previsão do artigo 469, §3º, da CLT que prevê o adicional de transferência para deslocamentos provisórios. 
    </p>
    <p>
A transferência do empregado consiste na alteração provisória do seu domicílio. O pressuposto legal apto a legitimar a percepção do mencionado adicional é a provisoriedade da transferência (CLT, artigo 469, "caput", da CLT e OJ 113 da SBDI-I do TST).
    </p>
    <p>
Logo, requer o pagamento do respectivo adicional, pelo período acima indicado, incluindo em sua base de cálculo a globalidade salarial por terem natureza salarial,  bem como os reflexos nos DSR, aviso prévio, 13º Salário; Férias (+1/3) e FGTS+40%.
    </p>
    `
    : ``
}
<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>
<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <tbody>
    <tr>
      <td colspan="2" style="font-weight: bold; background-color: #f0f0f0; padding: 10px;">
        O pagamento do respectivo ADICIONAL DE TRANSFERÊNCIA, incluindo<br> em sua base de cálculo a globalidade salarial por terem natureza salarial, nos termos da fundamentação supra
      </td>
      <td style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do adicional de transferência no aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do adicional de transferência nos 13º salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do adicional de transferência nas Férias +1/3</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do adicional de transferência no FGTS + 40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
<h3>DAS DIFERENÇAS SALARIAIS</h3>
${
  formData.ultimoSalario && formData.ultimoSalario !== ''
    ? `
  <h3>DA DIFERENÇA SALARIAL PELA FUNÇÃO EXERCIDA E RETIFICAÇÃO DA CTPS</h3>
  <p>
Conforme acima narrado, o Reclamante fora admitido aos [inserir data] na função de [inserir função]. Entretanto, efetivamente, sempre desempenhou a função de [inserir função], contudo, a Reclamada não procedeu à alteração da função na CTPS obreira, quiçá, concedeu a promoção salarial pertinente ao desempenho da função.
</p>
<p>
Com efeito, conforme se depreende da Cláusula [inserir] da Convenção Coletiva da categoria profissional do obreiro (doc. anexo) o piso salarial do [inserir função] corresponde a R$ [inserir valor] [inserir vigência] e R$ [inserir valor] [inserir vigência], acrescido de 30% de adicional de periculosidade, enquanto o Reclamante recebia apenas R$ [inserir valor], acrescido de 30% de adicional de periculosidade.
</p>
<p>
Portanto, nos moldes do art. 460 da CLT, faz jus o reclamante à retificação de sua CTPS, para constar a correta função desempenhada, qual seja, [inserir função] e, o respectivo pagamento das diferenças salariais, oriunda da diferença de salário acima apontadas, bem como seus reflexos nas demais verbas, tais como: horas extras/reflexos, adicional de periculosidade/reflexos, 13º salário, férias acrescidas de 1/3, prêmio e FGTS.
</p>
<p>
DO PEDIDO CONDICIONADO A ESTA TESE:
</p>
<p>
A condenação da Reclamada na obrigação de fazer, com a retificação de sua CTPS, para constar a correta função desempenhada, qual seja, [inserir função] desde o início do contrato e, o respectivo pagamento das diferenças salariais em todo o período contratual, desde a admissão, em razão da real função exercida;
</p>
<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DIFERENÇA SALARIAL, pela função exercida, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}

${
  formData.desvioFuncao === 'Sim'
    ? `
    <h3>DO ADICIONAL DE ACÚMULO DE FUNÇÃO</h3>
  <p>
Como exposto acima, o Reclamante ${formData.cargoDesempenhado ? formData.cargoDesempenhado : '[descrever atividades]'} ${formData.atividadesDesvio ? formData.atividadesDesvio : '[descrever atividades]'}, o qual era utilizado por ser necessário ao desempenho da função.
</p>
<p>
Ocorre que, de acordo com a cláusula nº [inserir] das CCT’s relativa aos anos de [inserir], respectivamente, preveem que em caso de acúmulo de função, é devido um adicional de 40% sobre o seu salário base, o que nunca foi cumprido pela Reclamada.
</p>
<p>
Assim, requer seja a Reclamada compelida no pagamento dos adicionais devidos a título de acúmulo de função, e diante da sua inequívoca natureza salarial, estes pagamentos deverão refletir em aviso prévio, férias acrescidas de 1/3, 13ºs salários, FGTS+40%.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        ADICIONAL DE ACÚMULO DE FUNÇÃO, no percentual não inferior a 40% de seu salário, ante o princípio constitucional da isonomia.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do acúmulo de função no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}

${
  formData.pagamentoPorFora === 'Sim'
    ? `
    <h3>
DOS REFLEXOS DO SALÁRIO “POR FORA”
    </h3>
  <p>
O reclamante recebia como salário o valor médio de R$ ${total ? total : '[inserir]'} mensais, que era composto da seguinte forma: salário base de R$ ${salario ? salario : '[inserir]'} (holerite) e cerca de R$ ${valorPorFora ? valorPorFora : '[inserir]'}, “por fora”.
</p>
<p>
O valor pago “por fora” era variável, uma vez que era calculado de acordo com o tipo de cliente das reclamadas, bem como pela distância a ser percorrida, segundo tabela fornecida pelas Reclamadas.
</p>
<p>
Embora não constasse do seu holerite e, portanto, não refletisse nas demais verbas trabalhistas, os valores pagos “por fora” eram salário, pois eram pagos habitualmente pela reclamada como contraprestação dos serviços prestados pelo reclamante.
</p>
<p>
Os valores pagos eram depositados [inserir forma de depósito na conta corrente, Pix, dinheiro].
</p>
<p>
Assim, faz jus o Reclamante ao recebimento da integração do valor de R$ [inserir] ao seu salário para todos os fins, com a consequente condenação da reclamada no pagamento dos seus reflexos nas seguintes verbas: aviso prévio, 13ºs salários, férias (+1/3), FGTS+40% e horas extras/reflexos.
</p>
<p>
Integrado ao salário do obreiro o valor pago “por fora”, esse deverá incidir ainda quanto à evolução salarial ocorrida durante o contrato de trabalho, a qual somente foi aplicada em relação ao salário consignado em holerites.
</p>
<p>
Ademais, deverá ser a reclamada compelida a efetuar as devidas anotações na CTPS do reclamante, no que tange ao seu salário extrafolha.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        REFLEXOS DO PAGAMENTO “POR FORA”, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos do pagamento “Por Fora” no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
${
  formData.salarioMenorMinimo === 'Sim'
    ? `
  <h3>DA DIFERENÇA SALARIAL – SALÁRIO-MÍNIMO, GARANTIA CONSTITUCIONAL</h3>
  <p>
Conforme já dito, o Reclamante, da admissão até ${formData.dataAdmissaoSemRegistro ? format(formData.dataAdmissaoSemRegistro, 'dd/MM/yyyy', { locale: ptBR }) : '[inserir data]'}, recebia como salário a quantia de R$ ${salario ? salario : '[inserir valor]'} por mês, valor este inferior ao salário-mínimo Nacional no ano de [inserir ano] que corresponde a R$ [inserir valor] por mês.
</p>
<p>
Verifica-se que a reclamada não respeitou o previsto na Constituição Federal de 1988 em seu artigo 7º, inciso VI, que garante aos trabalhadores o direito à percepção de um salário-mínimo fixado em lei, para que seja possível o atendimento das necessidades vitais básicas.
</p>
<p>
Portanto, faz jus o Reclamante ao pagamento das diferenças salariais no importe médio de R$ ${salario ? salario : '[inserir valor]'} /mês, oriunda da diferença de salário acima apontada, bem como seus reflexos nas demais verbas, tais como: Aviso prévio, horas extras/reflexos, 13º salário, férias acrescidas de 1/3, FGTS + 40%, horas extras/reflexos.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DIFERENÇA DE SALÁRIO, considerando o salário-mínimo nacional vigente, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
${
  formData.salarioSubstituicao === 'Sim'
    ? `
  <h3>DO SALÁRIO SUBSTITUIÇÃO</h3>
  <p>
Embora tenha sido anotada na CTPS obreira a função de ${formData?.cargoCtps ? formData.cargoCtps : '[inserir]'} durante todo o período contratual, efetivamente essa não foi a única função desempenhada pelo Reclamante.
</p>
<p>
Isso porque, durante o período contratual, no mês de ${formData?.dataAdmissaoSubstituido ? format(formData.dataAdmissaoSubstituido, 'MMMM', { locale: ptBR }) : '[inserir]'} de ${formData.dataAdmissaoSubstituido ? format(formData.dataAdmissaoSubstituido, 'yyyy', { locale: ptBR }) : '[inserir]'}, o Reclamante exerceu a função de ${formData.cargoSubstituido ? formData.cargoSubstituido : '[inserir]'} em substituição ao Sr(a). ${formData.nomeSubstituido ? formData.nomeSubstituido : '[inserir nome do substituído]'}, durante o gozo de férias deste. O substituído recebia um salário de R$ ${salarioSubstituicao ? salarioSubstituicao : '[inserir]'}/mês.
</p>
<p>
Nessas ocasiões, o Reclamante assumia integralmente as funções de [inserir], competindo-lhe [descrever atividades].
</p>
<p>
Assim, ao cobrir as férias do referido colega, o Reclamante teria o direito ao recebimento do salário de seu substituído, enquanto durar a substituição, conforme entendimento preconizado pela súmula 159 do Tribunal Superior do Trabalho.
</p>
<p>
Contudo, o Reclamante nunca recebeu qualquer valor a título de pagamento do salário substituição a que faria jus.
</p>
<p>
Assim, a Reclamada deverá ser condenada a pagar ao Reclamante as diferenças no pagamento do salário substituição, levando-se em conta o salário de Encarregado, bem como seus reflexos nos DSR’s; aviso prévio; 13º Salário; férias (+1/3), FGTS+40%; horas extras/reflexos e adicional de periculosidade/reflexos.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DIFERENÇAS SALÁRIO SUBSTITUIÇÃO, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
${
  formData.equiparacaoSalarial === 'Sim'
    ? `
  <h3>DA EQUIPARAÇÃO SALARIAL E DA RETIFICAÇÃO DA CTPS </h3>
  <p>
Como dito, o Reclamante foi admitido pela 1ª Reclamada em ${format(formData.dataAdmissaoParadigma, 'dd/MM/yyyy', { locale: ptBR })}, tendo sido anotada em sua CTPS a função de ${formData.cargoParadigma || '[Função]'}.
</p>

<p>
Entretanto, efetivamente, sempre exerceu a função de [Função]. Enquanto [Função], o Reclamante desempenhava a mesma função do Sr. ${formData.nomeParadigma || '[nome do paradigma]'} (paradigma ora indicado), que percebia salário mensal de ${formData.salarioParadigma}, enquanto o obreiro recebia apenas R$ ${salario} mensais.
</p>

<p>
Cumpre registrar que, como [Função], ambos realizavam [descrever atividades].
</p>

<p>
Havia a identidade de função entre o reclamante e o paradigma, pois desempenhavam suas atividades com a mesma produtividade e perfeição técnica.
</p>

<p>
Assim, por força do art. 461, CLT, a Reclamada deverá ser condenada no pagamento das diferenças salariais oriundas da equiparação salarial acima indicada, e o respectivo pagamento das diferenças salariais, oriunda da diferença de salário acima apontada ([inserir período]), bem como seus reflexos nas demais verbas, tais como: DSR’s, horas extras/reflexos, produção/reflexos, adicional de periculosidade/reflexos, 13º salário, férias acrescidas de 1/3 e FGTS.
</p>

<p>
Ademais, deverá ser a Reclamada compelida a apresentar, em sede de audiência inaugural, os comprovantes de pagamento do paradigma indicado, sob as cominações do art. 400, CPC.
</p>

<p>
Assim, faz jus o Reclamante à retificação de sua CTPS, para constar a correta função desempenhada desde admissão, qual seja, [Função].
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<p>
Seja declarada a identidade de função do Reclamante e o paradigma, no período indicado e, por conseguinte, retificada a sua CTPS, conforme fundamentação acima;
</p>

<p>
Sejam as Reclamadas condenadas no pagamento das seguintes verbas (VENCIDAS E VINCENDAS), sendo que as horas extras deverão ser apuradas com base na globalidade salarial (SALÁRIO + EQUIPARAÇÃO + PERICULOSIDADE + PRODUÇÃO), a saber:
</p>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DIFERENÇAS SALARIAIS, ante a equiparação salarial pleiteada, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos da diferença salarial no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
${
  formData?.beneficios && formData.beneficios.includes('Transporte')
    ? `
    <h3>DAS DIFERENÇAS DO VALE TRANSPORTE</h3>
    <p>
A Reclamada deixou de efetuar o pagamento integral do vale transporte para o labor de [inserir período].
</p>

<p>
Isso porque, o obreiro utilizava [inserir quantidade] conduções por dia para se deslocar, no valor de R$ 4,20 cada e, duas municipais, no valor de R$ [inserir] cada.
</p>

<p>
A utilização acima demonstrada, resulta no montante mensal de R$ ${valorDevidoTransporte}.
</p>

<p>
Ocorre que, a reclamada fornecia à obreira apenas o importe de R$ ${valorRecebidoTransporte} mensais, resultando numa diferença de R$ ${valorDevidoTransporte - valorRecebidoTransporte} mensais, tendo o obreiro que custear do próprio bolso o valor dessa diferença para o seu deslocamento até o trabalho, em desacordo com o previsto na Lei n.º 7.418.
</p>

<p>
Assim, deve a reclamada ser impelida a indenizar ao reclamante nos valores correspondentes à diferença de vale transporte durante todo o pacto laboral, no valor mensal de R$ ${valorDevidoTransporte - valorRecebidoTransporte}.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DAS DIFERENÇAS DO VALE TRANSPORTE
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ [inserir]</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Diferença mensal do vale transporte</td>
      <td style="text-align: right; padding: 10px;">R$ [inserir]</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Total devido durante o pacto laboral</td>
      <td style="text-align: right; padding: 10px;">R$ [inserir]</td>
    </tr>
  </tbody>
</table>
  `
    : ``
}
<h3>DA JORNADA DE TRABALHO - DAS HORAS EXTRAS</h3>
<p>
Durante o contrato de trabalho a parte autora trabalhou de ${formData.jornadaReal}, em média, das ${formData.horarioTrabalho}, com 30 minutos de intervalo para refeição e descanso, folgando apenas 2 (dois) domingos no mês. Todavia, a 1ª Reclamada não pagou corretamente as horas extras, ressaltando-se que o reclamante laborou nos seguintes feriados:
</p>

<p>
[inserir tabela]
</p>

<p>
Ocorre, que o art. 7º, XIII da Constituição Federal estabelece que o limite da jornada de trabalho seja de 8 horas diárias e 44 horas semanais.
</p>

<p>
Vale ressaltar que, o autor nunca anotou corretamente o cartão de ponto, por imposição da 1ª Reclamada, razão pela qual IMPUGNA desde já os cartões que vierem aos autos por ocasião da defesa.
</p>

<p>
A reclamada menciona a existência de sistema de banco de horas, no entanto, jamais forneceu qualquer informação sobre o crédito, débito e saldo de horas, assim como, não apresentou ao obreiro a regulamentação deste sistema pelo sindicato, razão pela qual desde já se requer a nulidade de eventual sistema de banco de horas que vier a ser apresentado pela Reclamada.
</p>

<p>
Além disso, cumpre esclarecer que o mesmo não era respeitado, eis que o obreiro não usufruía regularmente das folgas necessárias à compensação das horas extras praticadas.
</p>

<p>
Portanto, podemos concluir que o Reclamante faz jus ao recebimento das horas extras, assim consideradas as excedentes à 8ª diária e 44ª semanal, acrescidas do percentual convencional e, na sua falta, o legal de 50%, para as prestadas de segunda a sábado, além de horas extras laboradas aos Domingos e Feriados, as quais devem ser pagas em dobro, incluindo em sua base de cálculo o adicional de periculosidade e adicional noturno, por terem natureza salarial, bem como seus reflexos nos DSR’s, aviso prévio, 13º Salário; Férias (+1/3) e FGTS + 40%.
</p>

<p>
Deverão ser deduzidos os valores já pagos sob o mesmo título.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<p>
Seja reconhecida a nulidade do controle de jornada do obreiro, visto não condizer com a realidade vivenciada;
</p>

<p>
Seja reconhecida a nulidade de eventual sistema de banco de horas que vier a ser apresentado pela Reclamada, conforme fundamentação acima;
</p>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORAS EXTRAS (50%), para as prestadas de segunda a sábado, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORAS EXTRAS (100%), para as prestadas aos domingos e feriados laborados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
${
  formData.jornadaReal === '12x36'
    ? `
  <h3>DA JORNADA DE TRABALHO - DAS HORAS EXTRAS</h3>
  <p>
Durante o contrato de trabalho a parte autora trabalhou em escala 12x36, em média, das ${formData.horarioTrabalho}, com 30 minutos de intervalo para refeição e descanso, folgando apenas 2 (dois) domingos no mês. Todavia, a 1ª Reclamada não pagou corretamente as horas extras, ressaltando-se que o reclamante laborou nos seguintes feriados:
</p>

<p>
[inserir tabela]
</p>

<p>
Ocorre, que o art. 7º, XIII da Constituição Federal estabelece que o limite da jornada de trabalho seja de 8 horas diárias e 44 horas semanais.
</p>

<p>
Vale ressaltar que, o autor nunca anotou corretamente o cartão de ponto, por imposição da 1ª Reclamada, razão pela qual IMPUGNA desde já os cartões que vierem aos autos por ocasião da defesa.
</p>

<p>
Ressalta-se que, o Reclamante mantinha acordo de compensação de horas em escala 12x36, contudo, nesse sistema, o empregado trabalha mais horas em um dia para diminuir sua carga horária em outro, a fim de ajustar a jornada semanal. No presente caso, o sistema de compensação de horas era inexistente, pois sistematicamente descumprido pela empresa, restando descaracterizado, e as horas prestadas além da jornada diária/semanal acordada deverão ser pagas como extraordinárias.
</p>

<p>
Ainda que se entendesse válido o acordo, a sua inexecução pela reclamada sempre justificaria a resolução do contrato com perdas e danos, ou seja, com o pagamento das horas extras devidas.
</p>

<p>
Além do mais, o item IV da Súmula 85 do TST dispõe que a prestação habitual de horas extras descaracteriza o acordo de compensação de horas/rodízio. Nesse caso, as horas que ultrapassarem a jornada semanal normal deverão ser pagas como horas extraordinárias e, quanto àquelas destinadas à compensação, deverá ser pago a mais apenas o adicional por trabalho extraordinário.
</p>

<p>
A reclamada menciona a existência de sistema de banco de horas, no entanto, jamais forneceu qualquer informação sobre o crédito, débito e saldo de horas, assim como, não apresentou ao obreiro a regulamentação deste sistema pelo sindicato, razão pela qual desde já se requer a nulidade de eventual sistema de banco de horas que vier a ser apresentado pela Reclamada.
</p>

<p>
Além disso, cumpre esclarecer que o mesmo não era respeitado, eis que o obreiro não usufruía regularmente das folgas necessárias à compensação das horas extras praticadas.
</p>

<p>
Portanto, podemos concluir que o Reclamante faz jus ao recebimento das horas extras, assim consideradas as excedentes à 8ª diária e 44ª semanal, acrescidas do percentual convencional e, na sua falta, o legal de 50%, para as prestadas de segunda a sábado, além de horas extras laboradas aos Domingos e Feriados, as quais devem ser pagas em dobro, incluindo em sua base de cálculo o adicional de periculosidade e adicional noturno, por terem natureza salarial, bem como seus reflexos nos DSR’s, aviso prévio, 13º Salário; Férias (+1/3) e FGTS + 40%.
</p>

<p>
Deverão ser deduzidos os valores já pagos sob o mesmo título.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<p>
Seja declarada a descaracterização do acordo de compensação de horas/rodízio;
</p>

<p>
Seja reconhecida a nulidade do controle de jornada do obreiro, visto não condizer com a realidade vivenciada;
</p>

<p>
Seja reconhecida a nulidade de eventual sistema de banco de horas que vier a ser apresentado pela Reclamada, conforme fundamentação acima;
</p>
  `
    : ``
}
<h3>INTERVALO INTRAJORNADA</h3>

<p>
A jornada acima descrita (30 minutos de intervalo), contraria o disposto no art. 71 da CLT (Cláusula XX, da Convenção Coletiva de Trabalho), que prevê um intervalo de 1h para refeição e descanso, além do pactuado contratualmente ${formData.intervaloContrato}. 
</p>

<p>
Assim, o Reclamante tem direito de receber 1h00 hora extra diária, acrescida do percentual convencional e, na sua falta, o legal de 50%, para as prestadas de segunda a sábado, além de horas extras laboradas aos Domingos/Feriados, as quais devem ser pagas em dobro, em razão da não concessão de intervalo para refeição e descanso, nos termos do art. 71, § 4º da CLT, incluindo em sua base de cálculo o adicional de periculosidade e adicional noturno, por terem natureza salarial, bem como seus reflexos nos DSR’s, aviso prévio, 13º Salário; Férias (+1/3) e FGTS + 40%. Deverão ser deduzidos os valores já pagos sob o mesmo título.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        01 HORA EXTRA diária, em razão da não concessão de intervalo para refeição e descanso, acrescidas do adicional convencional ou, na falta deste, adicional legal para aquelas praticadas de segunda a sábado e em dobro para aquelas praticadas nos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<h3>DO INTERVALO INTERJORNADA – EM RAZÃO DA NÃO CONCESSÃO DE INTERVALO MÍNIMO ENTRE JORNADAS – ARTIGO 66 DA CLT</h3>

<p>
Pela jornada de trabalho exercida, pode-se verificar que o Reclamante não gozava do intervalo mínimo de 11 horas entre duas jornadas, conforme disposto no art. 66 da CLT. Sobre o assunto, aliás, ainda importa destacar o entendimento do E. TST, consolidado na OJ 355 da SDI – I.
</p>

<p>
Assim, a parte autora tem direito de receber as horas extras resultantes do não cumprimento do intervalo mínimo entre duas jornadas, estabelecido no art. 66 da CLT, acrescida de 50% para as horas prestadas de segunda a sábado e em dobro para as prestadas em domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, bem como seus reflexos nos DSR’s, aviso prévio, 13º Salário, Férias (+1/3) e FGTS+40%.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORA EXTRA, em razão do não cumprimento do intervalo interjornada, estabelecido no art. 66 da CLT, acrescidas do adicional convencional e, na sua falta, o legal de 50% para as horas prestadas de segunda a sábado, e em dobro para as prestadas aos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e a gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
${
  formData.jornadaReal === 'Segunda-feira a domingo' ||
  formData.jornadaReal === 'Segunda-feira a sexta-feira'
    ? `
    <h3>DAS HORAS EXTRAS PELO NÃO CUMPRIMENTO DO INTERVALO INTERSEMANAL DE 35 HORAS (artigos 66 e 67 da CLT)</h3>

<p>
Pela jornada de trabalho exercida, pode-se verificar que o Reclamante não gozava do intervalo intersemanal de 35 horas, composto pelo intervalo mínimo de 11 horas entre duas jornadas (art. 66 da CLT) somadas às 24 horas do descanso semanal (art. 67 da CLT). Sobre o assunto, aliás, ainda importa destacar o entendimento do E. TST, consolidado na Súmula 110.
</p>

<p>
O desrespeito aos artigos supracitados gera ao empregado o direito de receber o pagamento do período correspondente ao tempo faltante para completar os intervalos entre jornadas, visto que as horas extras decorrentes do elastecimento da jornada de trabalho e aquelas provenientes da incorreção na concessão do intervalo entre jornadas não se confundem, pois decorrem de fatos geradores diversos.
</p>

<p>
Esse é o atual e predominante entendimento do C. TST:
</p>

<blockquote>
RECURSO DE REVISTA INTERPOSTO SOB A ÉGIDE DA LEI N.º 13.015/2014. HORAS EXTRAS. INTERVALO INTERSEMANAL DE 35 HORAS. DESCUMPRIMENTO. O art. 67 da CLT dispõe que é assegurado a todo empregado um descanso semanal de 24 horas consecutivas. Já o art. 66 estabelece um período mínimo de 11 horas consecutivas de descanso entre duas jornadas de trabalho, o qual, segundo a Súmula 110 do TST, deverá ser usufruído imediatamente após o repouso semanal de 24 horas. A reunião das referidas pausas constitui o intervalo intersemanal de 35 horas, cujo desrespeito importa em reconhecimento do direito do empregado ao recebimento das horas extras correspondentes ao tempo suprimido, nos exatos termos da Súmula 110 do TST e da Orientação Jurisprudencial 355 da SBDI-1 do TST, sem prejuízo da remuneração relativa ao descanso semanal remunerado. No caso dos autos, o fato de o empregado laborar em desobediência aos ditames insculpidos nos artigos 66 e 67 da Consolidação das Leis do Trabalho implica descumprimento do dispositivo constitucional em epígrafe, na medida em que esses dispositivos visam proporcionar ao empregado descanso, para se restabelecer do desgaste sofrido na jornada laboral. Precedentes. Recurso de revista não conhecido. (TST - RR: 16204020165120030, Relator: Maria Helena Mallmann, Data de Julgamento: 01/12/2021, 2ª Turma, Data de Publicação: 03/12/2021)
</blockquote>

<p>
Assim, a parte autora tem direito a receber as horas extras resultantes do não cumprimento do intervalo intersemanal, estabelecido nos arts. 66 e 67 da CLT, acrescidas do adicional convencional e, na sua falta, o legal de 50% para as horas prestadas de segunda a sábado, e em dobro para as prestadas aos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, bem como seus reflexos nos DSR’s, aviso prévio, 13º Salário, Férias (+1/3) e FGTS+40%.
</p>

<h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORA EXTRA, em razão da não concessão do intervalo intersemanal de 35 horas, acrescidas do adicional convencional ou, na falta deste, adicional legal para aquelas praticadas de segunda a sábado e em dobro para aquelas praticadas nos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>
    `
    : ``
}
${
  formData.sobreaviso === 'Sim'
    ? `
    <h3>DAS HORAS DE SOBREAVISO</h3>
  
  <p>
  Durante todo o contrato, o Reclamante atuou em regime de escala de plantão, com frequência à disposição da empresa fora do horário regular.
  </p>
  
  <p>
  Tal disponibilidade ocorria de forma contínua, com frequência mensal de <span class="bold">${formData.frequenciaSobreaviso}</span>, em regime de sobreaviso por períodos de <span class="bold">${formData.horariosSobreaviso}</span>.
  </p>
  
  <p>
  Nesse contexto, era acionado com frequência de <span class="bold">${formData.frequenciaAcionamento}</span> para atender a demandas operacionais, realizando atividades com duração média de <span class="bold">${formData.horasAcionamento}</span> por acionamento.
  </p>
  
  <p>
  Cumpre esclarecer que, a atividade do reclamante consistia em ${formData.atividadesDesempenhadas}.
  </p>
  
  <p>
  Assim, o Reclamante tinha sua locomoção restrita durante esses dias em que ficava de plantão, não podendo se deslocar para grandes distâncias, (por determinação da empresa), dada a iminência de ser convocado a qualquer hora, bem como em razão das constantes convocações, que aconteciam.
  </p>
  
  <p>
  Em razão da expectativa de ser acionado, o que de fato ocorria, cerceava-lhe a liberdade, mantendo-o psicologicamente ligado à atribuição funcional.
  </p>
  
  <p>
  Assim, faz jus ao recebimento de horas de sobreaviso, por aplicação analógica do art. 244, § 2º da CLT, bem como seus regulares reflexos nos DSR’s, aviso prévio, 13º salários, férias (+1/3), FGTS+40% e adicional de periculosidade/reflexos.
  </p>
  
  <h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>
  
  <table border="1" cellspacing="0" cellpadding="10" width="100%">
    <thead>
      <tr>
        <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
          HORAS DE SOBREAVISO, conforme fundamentação acima.
        </th>
        <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos das horas de sobreaviso nos DSR’s</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos das horas de sobreaviso no 13º Salários</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos das horas de sobreaviso nas Férias (+1/3)</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos das horas de sobreaviso no Aviso Prévio</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos das horas de sobreaviso no FGTS+40%</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
    </tbody>
  </table>
  `
    : ``
}
${
  formData.tinhaDireitoSemReceber === 'Sim' &&
  formData.adicionaisDevidos.includes('Noturno')
    ? `
    <h3>DO ADICIONAL NOTURNO</h3>
  
  <p>
  Conforme acima narrado, o obreiro ativou-se em jornada noturna, nos termos do art. 73, § 2º da CLT.
  </p>
  
  <p>
  Ocorre que, a reclamada jamais remunerou corretamente o reclamante da forma devida, vez que nunca respeitou a hora noturna reduzida, prevista no artigo 73, § 1º, da CLT, assim como não observou a prorrogação da jornada noturna até as 7h00, conforme previsto na Súmula 60 do E. TST, segundo a qual: “Cumprida integralmente a jornada no período noturno e prorrogada esta, devido é também o adicional quanto às horas prorrogadas. Exegese do art. 73, § 5º, da CLT”.
  </p>
  
  <p>
  Portanto, o obreiro faz jus ao pagamento das diferenças de adicional noturno, considerando a redução e a prorrogação da hora noturna até às 7h00 (§ 1º do artigo 73 da CLT), bem como seus reflexos em DSR’s, aviso prévio, 13º salário, férias + 1/3, FGTS+40% e Adicional de Periculosidade/Reflexos, devendo ainda integrar a base de cálculo das horas extras/reflexos, nos exatos termos da Súmula 60, I, do C.TST.
  </p>
  
  <p>
  Deverão ser deduzidos os valores já pagos sob o mesmo título.
  </p>
  
  <h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>
  
  <table border="1" cellspacing="0" cellpadding="10" width="100%">
    <thead>
      <tr>
        <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
          ADICIONAL NOTURNO, conforme fundamentação acima.
        </th>
        <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos do adicional noturno nos DSR’s</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos do adicional noturno no 13º Salários</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos do adicional noturno nas Férias (+1/3)</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos do adicional noturno no Aviso Prévio</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 10px;">Reflexos do adicional noturno no FGTS+40%</td>
        <td style="text-align: right; padding: 10px;">R$ 0,00</td>
      </tr>
    </tbody>
  </table>
  `
    : ``
}
${
  formData.modalidadeDispensa ===
  'Encerramento do Contrato Temporário ou de Experiência'
    ? `
        <h3>MULTA DO ARTIGO 479, DA CLT</h3>
    
    <p>
    O Reclamante foi dispensado antes do término do contrato de trabalho firmado por prazo determinado.
    </p>
    
    <p>
    Diante disso, nos termos do artigo 481 da Consolidação das Leis do Trabalho, impõe-se o reconhecimento da conversão do contrato para a modalidade por prazo indeterminado, sendo devidas, consequentemente, as verbas rescisórias pertinentes.
    </p>
    
    <p>
    Nesse contexto, faz jus o Reclamante ao pagamento do aviso prévio, conforme entendimento consolidado na Súmula nº 163 do C. TST, bem como aos seus reflexos em 13º salário proporcional, férias proporcionais acrescidas do terço constitucional e FGTS com a multa de 40%. Ademais, é devida a indenização prevista no artigo 479 da CLT, em razão da rescisão antecipada do contrato sem justa causa por parte da Reclamada.
    </p>
    
    <h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>
    
    <table border="1" cellspacing="0" cellpadding="10" width="100%">
      <thead>
        <tr>
          <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
            MULTA DO ARTIGO 479, DA CLT, conforme fundamentação acima.
          </th>
          <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" style="padding: 10px;">Reflexos da multa no 13º Salário proporcional</td>
          <td style="text-align: right; padding: 10px;">R$ 0,00</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px;">Reflexos da multa nas Férias (+1/3)</td>
          <td style="text-align: right; padding: 10px;">R$ 0,00</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px;">Reflexos da multa no FGTS + 40%</td>
          <td style="text-align: right; padding: 10px;">R$ 0,00</td>
        </tr>
      </tbody>
    </table>`
    : ``
}
${
  formData.fgtsCorreto === 'Não'
    ? `
   <h3>DAS DIFERENÇAS DE FGTS</h3>
    
    <p>
    A reclamada não depositou corretamente o FGTS na conta vinculada do reclamante, nos meses de ${formData.periodoFgts}, conforme extrato analítico anexo.
    </p>
    
    <p>
    Assim, a reclamada deve pagar ao Reclamante as diferenças do FGTS, acrescidos da multa de 40% pela injusta dispensa, observada a Súmula 461 do TST.
    </p>
    
    <p>
    Ademais, é de se ressaltar que a reclamada não efetuou o pagamento da multa de 40% do FGTS devida ao reclamante pela injusta dispensa.
    </p>
    
    <p>
    Vale lembrar que sobre os valores do FGTS não depositados, devem incidir correção monetária, e juros de 1% ao mês.
    </p>
    
    <p>
    Deverão ser deduzidos os valores eventualmente depositados em conta vinculada e comprovados a mesmo título mediante juntada das guias "GR", "RE" e “GFIP”.
    </p>
    
    <h3>DO PEDIDO CONDICIONADO A ESTA TESE:</h3>
    
    <table border="1" cellspacing="0" cellpadding="10" width="100%">
      <thead>
        <tr>
          <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
            DEPÓSITOS DA DIFERENÇA DO FGTS ${formData.periodoFgts}
          </th>
          <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
        </tr>
      </thead>
    </table>
  `
    : ``
}

${
  formData.prazoRescisao === 'Não'
    ? `
   <h3>DA MULTA DO ART. 467 DA CLT</h3>
    
    <p>
    Na data do seu comparecimento à Justiça do Trabalho, a reclamada deverá pagar ao reclamante a parte incontroversa das verbas rescisórias, sob pena de pagá-las acrescidas de 50%, nos termos do art. 467 da CLT.
    </p>

     <h3>DA MULTA DO ART. 477 DA CLT</h3>
    
    <p>
    O Reclamante foi dispensado sem justa causa aos ${formData?.dataDispensa ? formData.dataDispensa.toString() : 'data não informada'}, com projeção do aviso prévio indenizado até ${formData.dataDispensaAvisoPrevio ? formData.dataDispensaAvisoPrevio.toString() : 'data não informada'}.
    </p>
    <p>
    Ocorre que, fora violado o prazo previsto no § 6º do art. 477 da CLT, para a homologação da rescisão contratual e fornecimento dos documentos hábeis ao saque do FGTS e recebimento do Seguro-Desemprego, conforme constou da ressalva no TRCT (doc. anexo), pelo que, o Reclamante tem direito à multa do § 8º do mesmo artigo.
    </p>
  `
    : ``
}
${
  formData.usavaVeiculoProprio === 'Sim' &&
  (formData.recebiaAluguelVeiculo === 'Não' ||
    formData.prometeramPagamentoVeiculo === 'Sim')
    ? `
  <h3>DO ALUGUEL DO VEÍCULO</h3>
    
    <p>
    Restou combinado entre as partes que, como o Reclamante trabalhava com veículo próprio, a Reclamada pagaria aluguel do veículo no valor de R$ ${formData.valorPrometidoVeiculo} mensais.
    </p>
    <p>
    O que, de fato, não foi cumprido integralmente pela Reclamada. Cumpre registrar que, tal irregularidade perdurou durante todo o contrato.
    </p>
    <p>
    Tal conduta violou o art. 468 da CLT, que veda qualquer alteração lesiva ao contrato de trabalho, além de gerar enriquecimento sem causa da Reclamada.
    </p>
    <p>
    É certo que a Reclamada deveria disponibilizar as ferramentas necessárias para a realização do trabalho do obreiro, pois o risco da atividade é da empresa, conforme artigo 2º da CLT, não podendo arcar o próprio trabalhador para o trabalho.
    </p>
    <p>
    Portanto, a Reclamada deve ser condenada a pagar ao Reclamante os valores mensais durante todo o contrato de trabalho, referente aos alugueres do veículo, no valor de R$ ${formData.valorPrometidoVeiculo} mensais.
    </p>`
    : ``
}
${
  formData.usavaVeiculoProprio === 'Sim' &&
  formData.recebiaAluguelVeiculo === 'Sim'
    ? `
  <h3>DIFERENÇAS DE ALUGUEL DE VEÍCULO</h3>
    
    <p>
    Durante todo o pacto laboral, o Reclamante utilizou de seu veículo próprio para a execução dos serviços, sendo certo que a Reclamada realizava o pagamento mensal no valor de R$ ${formData.valorAluguelVeiculo}.
    </p>
    <p>
    Entretanto, a previsão do Anexo I da CCT do sindicato do Reclamante (anexo) dispõe que o valor devido ao veículo de ano similar ao carro do Reclamante seria de R$ 536,61 mensais no ano de 2018/2019 e R$ 558,07 mensais no ano de 2019/2021.
    </p>
    <p>
    Desta forma, requer que a Reclamada seja compelida a pagar as diferenças do valor do aluguel do veículo, de acordo com o instituído no Anexo I da CCT do Reclamante, sendo as diferenças mensais de R$ 136,61 no período até 2019 e R$ 158,07 de 2020 até o final do contrato.
    </p>
  `
    : ``
}

${
  formData.usavaVeiculoEmpresa === 'Sim' && formData.tinhaGaragem === 'Não'
    ? `
  <h2 class="section">RESTITUIÇÃO DAS DESPESAS COM ALUGUEL DE GARAGEM</h2>

<p>
Quando da contratação, a 1ª Reclamada impôs ao obreiro, como condição para a formalização do vínculo, a existência de vaga de garagem para o pernoite do veículo da empresa. Na ocasião, informou ao Reclamante que, caso não possuísse garagem em sua residência, deveria alugar um local para guardar o veículo corporativo.
</p>

<p>
Sem alternativa, o Reclamante teve que alugar uma garagem para essa finalidade, arcando com despesas mensais no valor de <span class="bold">R$ ${formData.valorAluguelGaragem || '110,00'}</span> (conforme contrato anexo).
</p>

<p>
Entretanto, tais valores devem ser <span class="bold">integralmente restituídos</span> pela Reclamada, uma vez que decorrem de exigência empresarial, vinculada diretamente à execução das atividades profissionais, sendo certo que <span class="bold">os riscos do negócio são de inteira responsabilidade do empregador</span>, conforme determina o art. 2º da CLT.
</p>

<p>
Portanto, requer-se que a Reclamada seja compelida a restituir os valores pagos pelo Reclamante a título de aluguel de garagem, no importe de <span class="bold">R$ ${formData.valorAluguelGaragem || '110,00'}</span> mensais, durante todo o pacto laboral, com a devida atualização monetária e juros legais.
</p>
  `
    : ``
}

${
  formData.usavaVeiculoEmpresa === 'Sim'
    ? `
  <h2 class="section">DO REEMBOLSO DO COMBUSTÍVEL</h2>

<p>
${
  formData.usavaVeiculoProprio === 'Sim'
    ? `O obreiro laborou utilizando-se de seu veículo próprio para desempenhar suas atividades para a Reclamada e, restou combinado entre as partes que, a Reclamada arcaria integralmente com as despesas atinentes ao combustível do veículo.`
    : `O obreiro laborou conduzindo o veículo da Reclamada para desempenhar suas atividades e, restou combinado entre as partes que, a Reclamada arcaria integralmente com as despesas atinentes ao combustível do veículo.`
}
</p>

<p>
O que, de fato, <span class="bold">não foi cumprido integralmente</span> pela Reclamada.
</p>

<p>
Isso porque, o valor fornecido ao Reclamante para o abastecimento do veículo <span class="bold">não era suficiente</span> para realizar todas as atividades estipuladas pela Reclamada, inclusive o acompanhamento de equipes que prestavam serviços aos clientes da segunda reclamada.
</p>

<p>
Dessa forma, o Reclamante teve que arcar com o custo da diferença de seu próprio bolso, no valor médio de <span class="bold">R$ ${formData.valorGastoReclamante || 'R$ 200,00'}</span> mensais.
</p>

<p>
Tal conduta viola o art. 468 da CLT, que veda qualquer alteração lesiva ao contrato de trabalho, além de gerar <span class="bold">enriquecimento sem causa</span> por parte da Reclamada.
</p>

<p>
Portanto, requer-se a condenação da Reclamada ao pagamento do reembolso das despesas com combustível suportadas pelo Reclamante durante todo o período contratual, no valor médio de <span class="bold">R$ ${formData.valorGastoReclamante || 'R$ 200,00'}</span> mensais, com correção monetária e juros legais.
</p>

  `
    : ``
}
${
  formData.temFilhoMenor === 'Sim' && formData.recebiaSalarioFamilia === 'Não'
    ? `
    <h2 class="section">DO SALÁRIO-FAMÍLIA</h2>

<p>
A Reclamante tem <span class="bold">${formData.quantidadeFilhos || 'duas'}</span> filhos menores de 14 anos de idade,  ${Array.from(
        { length: Number(formData.quantidadeFilhos) },
      )
        .map(() => `[Quantidade filhos] com [idade filho] anos`)
        .join(' e ')}.
</p>

<p>
Nos termos do art. 7º, inciso XII, da Constituição Federal, e dos arts. 65 e 68 da Lei 8.213/91, a Reclamante — como empregada de baixa renda — fazia jus ao recebimento do <span class="bold">salário-família</span> durante todo o pacto laboral.
</p>

<p>
Para o ano de 2023, o valor do salário-família era de <span class="bold">R$ 59,82</span> por filho, para trabalhadoras com remuneração de até R$ 1.754,18, conforme estabelecido na Portaria Interministerial MPS/MF nº 26, de 10 de janeiro de 2023.
</p>

<p>
Já no ano de 2024, o valor passou para <span class="bold">R$ 62,04</span> por filho, aplicável àquelas com salário de até R$ 1.819,26, conforme Portaria Interministerial MPS/MF nº 2, de 11 de janeiro de 2024.
</p>

<p>
Entretanto, a Reclamante <span class="bold">não recebeu</span> nenhum valor a esse título durante a vigência do contrato de trabalho, razão pela qual requer a condenação da Reclamada ao pagamento do benefício legal, acrescido de correção monetária e juros legais.
</p>
    `
    : ``
}
${
  formData.descontoIndevido === 'Sim' && formData.descontoHolerite === 'Sim'
    ? `
    <h2 class="section">DOS DESCONTOS INDEVIDOS</h2>

<p>
A primeira Reclamada descontou indevidamente valores das verbas salariais do Reclamante, conforme tabela abaixo:
</p>

<table border="1" cellspacing="0" cellpadding="6" width="100%">
  <thead>
    <tr style="background-color: #f0f0f0;">
      <th>MÊS/ANO</th>
      <th>TÍTULO</th>
      <th>VALOR</th>
    </tr>
  </thead>
  <tbody>
    ${
      formData.descontosHoleriteSelecionados?.length
        ? formData.descontosHoleriteSelecionados
            .map((item) => {
              return `
              <tr>
                <td>${formData.mesAtraso || '00/0000'}</td>
                <td>${item}</td>
                <td>R$ 0,00</td>
              </tr>
            `;
            })
            .join('')
        : `
        <tr>
          <td>00/0000</td>
          <td>EXEMPLO</td>
          <td>R$</td>
        </tr>
        <tr>
          <td>00/0000</td>
          <td>EXEMPLO</td>
          <td>R$</td>
        </tr>
      `
    }
    <tr>
      <td colspan="2" style="text-align: right;"><strong>VALOR TOTAL</strong></td>
      <td style="text-align: right;"><strong>R$ ${formData.valorTotalDescontosHolerite || '0,00'},00</strong></td>
    </tr>
  </tbody>
</table>

<p>
Entretanto, estes descontos foram efetuados <span class="bold">indevidamente</span>.
</p>

<p>
Há de se destacar, primeiramente, que o Reclamante jamais agiu — ou age — com o intuito de prejudicar os bens da empresa. Ao contrário, sempre desempenhou suas funções com zelo, responsabilidade e dedicação, jamais causando qualquer dano ferramental ou avaria em veículos da Reclamada.
</p>

<p>
Não obstante, os descontos relativos a “danos” e “multas” foram efetuados sem qualquer prova de autoria, tampouco com apuração clara dos valores cobrados.
</p>

<p>
No mesmo sentido, descontos relacionados a “materiais”, “telefone”, “almoxarifado” e “ferramentas” também se mostram indevidos, já que o Reclamante jamais perdeu qualquer material, tampouco recebeu advertências formais a esse respeito.
</p>

<p>
Ocorre que, durante a vigência do contrato de trabalho, a Reclamada coagiu o Reclamante a assinar autorizações de desconto como condição para fornecimento de materiais necessários ao exercício de suas atividades, em clara afronta ao princípio da boa-fé. 
</p>

<p>
Desse modo, restam desde já impugnadas todas as autorizações de desconto assinadas sob coação, devendo ser consideradas inválidas.
</p>

<p>
Aliás, salutar destacar que todos os riscos advindos da atividade econômica explorada pela Reclamada são de sua exclusiva responsabilidade, não podendo ser transferidos ao trabalhador (art. 2º da CLT).
</p>

<p>
O Direito do Trabalho, aliás, tem como um de seus postulados fundamentais o <span class="bold">princípio da intangibilidade salarial</span>, sendo vedados quaisquer descontos salariais não previstos em lei.
</p>

<p>
Portanto, requer-se a condenação da Reclamada à <span class="bold">restituição integral</span> de todos os valores descontados indevidamente durante o pacto laboral, bem como no momento da rescisão contratual, conforme detalhado na tabela acima, com correção monetária e juros legais.
</p>

    `
    : ``
}
<h2>DA JUSTIÇA GRATUITA</h2>
  <p>De proêmio, esclarece que a parte autora buscou a presente justiça especializada para a obtenção de seus direitos sonegados, porém, não possui condições de arcar com as despesas e custas processuais, quiçá com o pagamento de honorários periciais e sucumbenciais.</p>

  <p>Assim, necessário se faz a concessão do benefício a parte, vez que comprova no ato da distribuição sua condição financeira frágil, através da juntada de sua carteira profissional e declaração de hipossuficiência.</p>

  <p>Frise-se que a declaração de pobreza firmada pelo próprio interessado sob as penas da lei é considerada prova de hipossuficiência econômica da pessoa física, consoante o art. 1º, caput, da Lei 7.115/1983, e o art. 99, §3º, do Código de Processo Civil.</p>

  <p>No mesmo sentido, segue o entendimento consolidado pelo C. Tribunal Superior do Trabalho através da Súmula 463, I, in verbis:</p>

  <blockquote>
    I - A partir de 26.06.2017, para a concessão da assistência judiciária gratuita à pessoa natural, basta a declaração de hipossuficiência econômica firmada pela parte ou por seu advogado, desde que munido de procuração com poderes específicos para esse fim (art. 105 do CPC de 2015)
  </blockquote>

  <p>E ainda, assim prevê a jurisprudência, in verbis:</p>

  <blockquote>
    RECURSO DE REVISTA. LEI Nº 13.467/17. JUSTIÇA GRATUITA. DECLARAÇÃO DE HIPOSSUFICIÊNCIA ECONÔMICA. SÚMULA 463 DO TST. A Súmula 463, item I, do TST, preconiza que "A partir de 26.06.2017, para a concessão da assistência judiciária gratuita à pessoa natural, basta a declaração de hipossuficiência econômica firmada pela parte ou por seu advogado, desde que munido de procuração com poderes específicos para esse fim (art. 105 do CPC de 2015)". Nesses termos, a mera declaração da parte quanto ao fato de não possuir condições de arcar com as despesas do processo, é suficiente para o fim de demonstrar a hipossuficiência econômica, bem como para a concessão da assistência judiciária gratuita, mesmo com as alterações conferidas pela Lei 13.467/2017. Precedentes. Recurso de Revista de que se conhece e a que se dá provimento. (TST - RR: 10009624620195020038, Relator.: Alberto Bastos Balazeiro, Data de Julgamento: 18/05/2022, 5ª Turma, Data de Publicação: 27/05/2022)
  </blockquote>

  <p>Outrossim, o requerimento de concessão de benefícios encontra previsão nos Princípios Constitucionais do direito de acesso à justiça e inafastabilidade da prestação jurisdicional, bem como no Princípio da Proteção inerente ao Direito do Trabalho e ainda os subprincípios: condição mais benéfica e in dubio pro misero, que nada mais são que desdobramentos do princípio da proteção, no intuito absoluto de proteger a parte hipossuficiente da relação trabalhista.</p>

  <p>Tais preceitos são compatíveis entre si e harmonizam-se perfeitamente com o princípio da inafastabilidade da jurisdição (art. 5º, XXXV, da Constituição Federal), razão pela qual o indeferimento da justiça gratuita mesmo com a constatação de declaração de hipossuficiência do trabalhador aos autos, revela-se contrária as disposições legais e sumular acima transcritas.</p>

  <p>Logo, considerando-se a evolução legislativa acima descrita, e o teor dos arts. 1º da Lei n.º 7.115/83 e 99, § 3º, do CPC de 2015, e Súmula 463 do C.TST., presume-se verdadeira e enseja a concessão dos benefícios da gratuidade da Justiça a declaração de pobreza firmada pela pessoa natural ou por seu procurador com poderes específicos, nos termos do art. 105 do CPC de 2015.</p>

  <p>Sendo assim, inegável que o entendimento pacificado do TST é de que basta a declaração feita pela parte autora, ou por seu advogado, de que não há condições de arcar com os custos do processo para que seja deferida a justiça gratuita.</p>

  <p>Diante de todo o exposto, requer-se que seja concedido os benefícios da Justiça Gratuita a parte autora, por esta ser pobre na acepção jurídica da palavra e não ter condições de arcar com as despesas do processo (inclusive os honorários periciais e custas de qualquer natureza), conforme declaração de hipossuficiência anexa.</p>

  <h2>DOS JUROS E CORREÇÃO MONETÁRIA</h2>
  <p>Pugna-se que sejam utilizados o índice IPCA-E como índice de correção monetária, visando uma maior aproximação do índice inflacionário.</p>

  <p>Isso porque, a decisão proferida em 18/12/2020 que julgou as ADC´s 58 e 59, o STF determinou que é inconstitucional a aplicação da Taxa Referencial (TR) para a correção monetária dos débitos trabalhistas na esfera desta Justiça Especializada, motivo pela qual, viola o direito de propriedade, porque sua incidência não enseja na atualização compatível com o fenômeno inflacionário, ressaltando que a partir da citação deve haver a aplicação, apenas, da SELIC, abrangendo não só a atualização monetária, mas, também, os juros de mora.</p>

  <p>Contudo, infelizmente, no ano seguinte (2021) a taxa SELIC fechou o ano em 4,35%, constata-se ser patamar inferior ao IPCA-E de 2021 (10,42%). Noutras palavras: o crédito permaneceu corroído e não foi recomposto o valor da moeda nem o será, tão cedo, não tendo sido atingido o escopo definido pelo próprio E. STF.</p>

  <p>Frise-se que a incidência da taxa SELIC impede a aplicação de outros índices de atualização, sob pena de bis in idem, ou seja, prejudica mais uma vez a parte autora e, portanto, não deve ser aplicada.</p>

  <p>Diante do exposto, devido se faz pronunciamento quanto a atualização e correção monetária a ser utilizada, para que seja observada a atualização pelo IPCA-E e aplicando-se os juros legais (artigo 39, caput, da Lei 8.177/91).</p>

  <h2>DOS HONORÁRIOS ADVOCATÍCIOS SUCUMBENCIAIS</h2>
  <p>Com o advento da Lei 13.467/2017, foi acrescentado o artigo 791-A à CLT autorizando a condenação em sucumbência à parte perdedora da ação, vejamos:</p>

  <blockquote>
    Art. 791-A. Ao advogado, ainda que atue em causa própria, serão devidos honorários de sucumbência, fixados entre o mínimo de 5% (cinco por cento) e o máximo de 15% (quinze por cento) sobre o valor que resultar da liquidação da sentença, do proveito econômico obtido ou, não sendo possível mensurá-lo, sobre o valor atualizado da causa.
  </blockquote>

  <p>Logo, arcará a Reclamada com os honorários advocatícios sucumbenciais em benefício do(a) advogado(a) da parte contrária.</p>

  <p>N’outra via, conforme tópico anterior, a parte autora é hipossuficiente e, portanto, deverá ser dispensada a sua obrigação ao pagamento dos respectivos honorários em prol da parte adversa, alinhando-se ao julgamento da ADI 5766, onde o Supremo Tribunal Federal, por maioria, declarou inconstitucional o §4º do art. 791-A da CLT.</p>

  <p>Nesta linha, aliás, o entendimento consubstanciado no Enunciado nº 100 da 2ª Jornada de Direito Material e Processual do Trabalho, promovida pela ANAMATRA, ANPT, ABRAT e SINAIT:</p>

  <blockquote>
    “É inconstitucional a previsão de utilização dos créditos trabalhistas reconhecidos em juízo para o pagamento de despesas do beneficiário da justiça gratuita com honorários advocatícios ou periciais (artigos 791-A, § 4º, e 790-B, §4º, da CLT, com a redação dada pela Lei nº 13.467/2017), por ferir os direitos fundamentais à assistência judiciária gratuita e integral, prestada pelo Estado e à proteção do salário (arts. 5º, LXXIV, e 7º, X, da Constituição Federal).”
  </blockquote>

  <p>Por derradeiro, ainda que V.Exa. entenda de forma diversa, o que não se espera, requer-se a eventual condenação autoral seja equânime do percentual fixado, salientando que o art. 100, §1º da Constituição Federal prevê que salários e vencimentos – caráter da verba adquirida em reclamatórias trabalhistas – representam débitos de natureza alimentícia, os quais encontram-se resguardados de penhora sob força do art. 883 do CPC, não podendo ser alvo de penhora, requer-se a suspensão de sua exigibilidade.</p>

  <h2>DA HIPOTECA JUDICIÁRIA</h2>
  <p>Dispõe o art. 495 do CPC, aplicável ao processo do trabalho, nos termos do art. 769 da CLT:</p>

  <blockquote>
    Art. 495. A decisão que condenar o réu ao pagamento de prestação consistente em dinheiro e a que determinar a conversão de prestação de fazer, de não fazer ou de dar coisa em prestação pecuniária valerão como título constitutivo de hipoteca judiciária.
  </blockquote>

  <p>A medida visa dar efetividade às sentenças e permitir ao credor que se assegure contra eventual insolvência e dilapidação do patrimônio do devedor no curso do processo, independente do seu lastro econômico quando do ajuizamento da ação (vide art. 792, III, do CPC). Não depende de pedido da parte autora ou mesmo do trânsito em julgado da ação.</p>

  <p>Sendo assim, em razão dos pedidos condenatórios elencados, requer a inscrição da sentença aqui prolatada nos cartórios de registro de imóveis e notas e protesto de todo o país, bem como nos órgãos de proteção ao crédito.</p>

  <h2>DOS PEDIDOS</h2>
  <p>Isso posto, requer:</p>
<p><strong>JUSTIÇA GRATUITA</strong> - Sejam concedidos ao Reclamante os benefícios da Justiça Gratuita, por ser esse pobre e não ter condições de arcar com as despesas do processo (declaração anexa);</p>
<p><strong>TUTELA ANTECIPADA</strong> - Seja concedida a antecipação dos efeitos da tutela expedindo-se alvará judicial para recebimento do FTGS depositado e parcelas do seguro-desemprego.</p>

<p><strong>SUBSIDIÁRIA</strong> - Seja a segunda Reclamada declarada responsável SUBSIDIÁRIA pelos créditos trabalhistas deferidos ao Reclamante no presente feito, nos termos da súmula 331, IV do TST;</p>

<p><strong>SOLIDARIEDADE</strong> - Reconhecimento da responsabilidade solidária das reclamadas pelas verbas decorrentes do contrato de trabalho que vierem a ser deferidas na presente ação.</p>

<p><strong>SUBSIDIARIEDADE</strong> – Sucessivamente, reconhecimento da responsabilidade subsidiária da segunda reclamada pelas verbas decorrentes do contrato de trabalho que vierem a ser deferidas na presente ação.</p>

<p><strong>HORAS EXTRAS</strong> - Seja reconhecida a nulidade do controle de jornada do obreiro, visto não condizer com a realidade vivenciada;</p>

<p><strong>BANCO DE HORAS</strong> - Seja reconhecida a nulidade de eventual sistema de banco de horas que vier a ser apresentado pela Reclamada, conforme fundamentação acima;</p>

<p>Reconhecimento da remuneração por <strong>PRODUÇÃO</strong>, composta pelo valor médio de R$ 0,00, com a anotação do respectivo salário na CTPS do Autor, sob pena de multa em favor do Reclamante;</p>

<p><strong>CONTRATO ATIVO</strong> - Em virtude do contrato de trabalho estar em vigor, pugna pelo recebimento de todas as verbas pleiteadas e seus reflexos, sejam elas vencidas e/ou vincendas.</p>

<p><strong>RESCISÃO INDIRETA</strong> - Seja declarada a rescisão indireta do contrato de trabalho, nos termos do art. 483, alínea “a”, “c”, “d” e “f” da CLT.</p>

<p><strong>INSALUBRIDADE/ PERICULOSIDADE</strong> - Seja determinada a realização de perícia técnica para apuração de insalubridade, com vistoria das atividades e local de trabalho do reclamante, bem como o deferimento para acompanhamento do reclamante. Requer ainda, seja cumprido o disposto no artigo 474 do CPC que determina ao Juízo que designe dia, hora e lugar em que terá início à diligência;</p>

<p>Seja realizada entrega do documento denominado PERFIL PROFISSIOGRÁFICO PREVIDENCIÁRIO – PPP e do LAUDO TÉCNICO DE CONDIÇÕES AMBIENTAIS DE TRABALHO – LTCA, sob pena de multa e astreintes;</p>

<p>Seja determinado que a Reclamada proceda com a anotação na CTPS do obreiro do período em que laborou nesta atividade (insalubre), em conformidade com o art. 29 da CLT;</p>

<p><strong>ESTABILIDADE GESTANTE (DISPENSA ARBITRÁRIA)</strong> – Seja declarada a nulidade do ato de dispensa, determinando-se a reintegração da obreira, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas. Caso vossa excelência entenda desaconselhável ou indevida a reintegração (súmula 244, do C.TST), seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas.</p>

<p><strong>ESTABILIDADE GESTANTE (ATIVO)</strong> - Reconhecimento e declaração do direito à estabilidade, em decorrência do estado gravídico, da ciência da gestação até cinco meses após o parto, ou seja, até janeiro/2026;</p>

<p><strong>NULIDADE DA JUSTA CAUSA</strong> – Seja declarada a nulidade da justa causa aplicada, com a consequente condenação no pagamento das verbas rescisórias decorrentes da dispensa injusta e, fornecimento das guias necessárias ao saque do FGTS e habilitação no seguro-desemprego;</p>

<p><strong>REVERSÃO DO PEDIDO DE DEMISSÃO</strong> - Seja revertido o pedido de demissão, para dispensa sem justa causa;</p>

<p>Seja a reclamada intimada a fornecer as guias pertinentes ao saque do FGTS + 40% e, para habilitação no programa do seguro-desemprego;</p>

<p><strong>SEM REGISTRO NENHUM</strong> – Seja reconhecido o vínculo de emprego, condenando-se a empregadora a promover o registro na CTPS do reclamante, em prazo e sob as penas a serem cominadas por vossa excelência, bem como que em caso de omissão seja autorizada a secretaria da vara a realizá-lo.</p>

<p><strong>COM REGISTRO PARCIAL</strong> - Seja reconhecido o vínculo empregatício com a 1ª Reclamada do período laborado sem registro de 00/00/0000 a 00/00/0000, e demais anotações de praxe pela reclamada, tendo em vista, que estão presentes os requisitos da pessoalidade, subordinação, não-eventualidade e onerosidade, conforme dispõem os arts. 2º e 3º da CLT;</p>

<p><strong>EQUIPARAÇÃO SALARIAL</strong> – Seja declarada a identidade de função do Reclamante e o paradigma, no período indicado e, por conseguinte, retificada a sua CTPS, conforme fundamentação acima;</p>

<h2>Vínculo de Emprego Diretamente com a Tomadora de Serviços</h2>
  <p>
    Seja reconhecido o vínculo empregatício com a tomadora de serviços, condenando-a a promover o 
    <strong>registro</strong>, em prazo e sob as penas a serem cominadas por Vossa Excelência, 
    bem como que, em caso de omissão, seja autorizada a secretaria da vara a realizá-lo.
  </p>
  <p>
    Sucessivamente, reconhecimento de vínculo de emprego com a cooperativa de trabalho, condenando-a 
    a promover o registro, em prazo e sob as penas a serem cominadas por Vossa Excelência, 
    bem como que, em caso de omissão, seja autorizada a secretaria da vara a realizá-lo.
  </p>
    <h2>Contrato Temporário</h2>
  <p>
    Seja declarada a <strong>nulidade do contrato temporário</strong> firmado, com o reconhecimento do vínculo de emprego diretamente com a tomadora, condenando-a a promover o <strong>registro</strong>, em prazo e sob as penas a serem cominadas por Vossa Excelência, bem como que, em caso de omissão, seja autorizada a secretaria da vara a realizá-lo.
  </p>
  <p>
    <em>OBRIGAÇÃO de fazer</em> dependente do pedido de nulidade do contrato temporário.
  </p>
 <h2>Contrato Temporário com Contratação pela Reclamada Depois</h2>
  <p>
    Seja declarada a <strong>nulidade do contrato temporário</strong> firmado, com o reconhecimento do vínculo de emprego diretamente com a tomadora, condenando-a a promover a <strong>retificação do registro</strong>, em prazo e sob as penas a serem cominadas por Vossa Excelência, bem como que, em caso de omissão, seja autorizada a secretaria da vara a realizá-lo.
  </p>
     <h2>Cooperativa de Trabalho</h2>
  <p>
    Seja declarada a <strong>nulidade do ato cooperado</strong>.
  </p>
    
      <h2>Acúmulo de Função</h2>
  <p>
    Restando a V. Exa., em consonância com o artigo 460 da CLT, indicar o valor a ser acrescido ao salário da trabalhadora, <strong>não inferior a 40% do seu salário atual</strong>.
  </p>

<h2>Nulidade do Acordo de Compensação em Labor Insalubre</h2>
  <p>
    Seja declarada a <strong>nulidade do acordo de compensação de jornada</strong>, eis que o reclamante se ativava em atividade insalubre.
  </p>
  <p><strong>Seja a parte reclamada condenada ao pagamento das seguintes verbas, que deverão ser apuradas com base na globalidade salarial, nos termos da Súmula 264 do C. TST, a saber:</strong></p>
<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORAS EXTRAS (50%), para as prestadas de segunda a sábado, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">REFLEXO DAS HORAS EXTRAS nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">REFLEXO DAS HORAS EXTRAS no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">REFLEXO DAS HORAS EXTRAS nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">REFLEXO DAS HORAS EXTRAS no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">REFLEXO DAS HORAS EXTRAS no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORAS EXTRAS (100%), para as prestadas aos domingos e feriados laborados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        01 HORA EXTRA diária, em razão da não concessão de intervalo para refeição e descanso, acrescidas do adicional convencional ou, na falta deste, adicional legal para aquelas praticadas de segunda a sábado e em dobro para aquelas praticadas nos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORA EXTRA, em razão do não cumprimento do intervalo intersemanal, estabelecido nos arts. 66 e 67 da CLT, acrescidas do adicional convencional e, na sua falta o legal de 50% para as horas prestadas de segunda a sábado, e em dobro para as prestadas aos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e a gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HORA EXTRA, em razão da não concessão de intervalo entre jornadas (art. 66 da CLT), acrescidas do adicional convencional ou, na falta deste, adicional legal para aquelas praticadas de segunda a sábado e em dobro para aquelas praticadas nos domingos e feriados, incluindo em sua base de cálculo o adicional de periculosidade e gratificação, por terem natureza salarial, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexos das horas extras no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DA PRODUÇÃO, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Ad. de Periculosidade</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Ad. de Periculosidade em 13º salário</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Ad. de Periculosidade em férias</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Ad. de Periculosidade em aviso prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Ad. de Periculosidade em FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        DO ADICIONAL DE INSALUBRIDADE, conforme fundamentação acima.
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção nos DSR’s</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no 13º Salários</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção nas Férias (+1/3)</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no Aviso Prévio</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 10px;">Reflexo da produção no FGTS+40%</td>
      <td style="text-align: right; padding: 10px;">R$ 0,00</td>
    </tr>
  </tbody>
</table>

<table border="1" cellspacing="0" cellpadding="10" width="100%">
  <thead>
    <tr>
      <th colspan="2" style="font-weight: bold; background-color: #f0f0f0; text-align: left; padding: 10px;">
        HONORÁRIOS ADVOCATÍCIOS
      </th>
      <th style="text-align: right; font-weight: bold; background-color: #f0f0f0; padding: 10px;">R$ 0,00</th>
    </tr>
  </thead>
</table>

<h3>REQUERIMENTOS FINAIS:</h3>

<h4>Requer-se:</h4>

${
  formData.adicionaisRecebidos === 'Sim' &&
  ((formData.adicionais && formData.adicionais.includes('Insalubridade')) ||
    (formData.adicionais && formData.adicionais.includes('Periculosidade')))
    ? `
  <p>
  Por oportuno, requer seja determinada a realização de perícia técnica para apuração de insalubridade/periculosidade. 
  Requer ainda, seja cumprido o disposto no artigo 431-A do CPC, que determina ao Juízo que designe dia, hora e lugar em que terá início a diligência.
</p>

  `
    : ``
}

${
  formData.doencaTrabalho === 'Sim' || formData.acidenteTrabalho === 'Sim'
    ? `
  <p>
  Por oportuno, requer seja determinada a realização de perícia médica. 
  Requer ainda, seja cumprido o disposto no artigo 431-A do CPC, que determina ao Juízo que designe dia, hora e lugar em que terá início a diligência.
</p>`
    : ``
}

<section>
  <p>Seja a primeira Reclamada compelida a acostar aos autos os comprovantes de pagamento do Reclamante, nos moldes do art. 464, CLT, bem como sejam deduzidos os valores pagos sob os mesmos títulos;</p>

  <p>Seja determinada a aplicação do IPCA-E como índice de correção monetária, aplicando-se os juros legais (artigo 39, caput, da Lei 8.177/91), visando uma maior aproximação do índice inflacionário;</p>

  <p>Requer a inscrição da sentença aqui prolatada nos cartórios de registro de imóveis e notas e protesto de todo o país, bem como nos órgãos de proteção ao crédito;</p>

  <p>Seja o imposto de renda decorrente dos créditos aqui postulados, calculado sob o regime de competência, respeitando a progressividade da tributação, pois, entendimento diverso implica em conferir ao Reclamante valor menor do que o que efetivamente receberia se quitado no momento oportuno;</p>

  <p>Seja observada a OJ nº 400 da SDI – 1 do C. TST, quanto aos juros de mora, que não devem integrar a base de cálculo do imposto de renda, independentemente da natureza jurídica da obrigação inadimplida, ante o cunho indenizatório conferido pelo art. 404 do Código Civil de 2002 aos juros de mora;</p>

  <p>Seja a Reclamada condenada no pagamento dos honorários sucumbenciais, nos termos dos artigos 791-A da CLT, no importe de 15% do valor das verbas deferidas, conforme apurado em liquidação de sentença;</p>

  <p>Seja a execução promovida e iniciada nestes autos, autorizando, desde já, a utilização de todos os meios disponíveis, tais como penhoras e bloqueios de contas bancárias via sistema BACENJUD, penhoras e bloqueios de veículos via sistema RENAJUD, penhoras e bloqueios de imóveis via sistema ARISP, e outros mais que estiverem disponíveis ao Juízo, sem exceção de nenhum deles;</p>

  <p>Seja a Reclamada notificada no endereço constante no preâmbulo desta, para que, querendo, conteste os termos da presente, sob pena de revelia, e, ao final, seja condenada ao pagamento das verbas ora pleiteadas, atualizadas monetariamente, acrescidas de juros e demais cominações de estilo e, por fim,</p>

  <p>Sejam todas as publicações e notificações do presente feito, sendo via Postal ou D.O.E., feitas em nome da Renata Sanches Guilherme e remetidas para o seguinte endereço: Av. Marquês de São Vicente, nº 182, 9º andar, Sala 91, Várzea da Barra Funda – São Paulo/SP (CEP 01139-001). Endereço eletrônico: e-mail contato@schsch.com.br.</p>
</section>

<section>
  <h2>DAS PROVAS</h2>
  <p>Requer a produção de todas as provas em direito admitidas, bem como as moralmente legítimas, especialmente o depoimento pessoal das Reclamadas, sob pena de confissão; oitiva de testemunhas que deverão ser intimadas para prestar os depoimentos e juntada de documentos.</p>
</section>

<section>
  <h2>VALOR DA CAUSA</h2>
  <p>Ressalte-se que, os valores aqui indicados não devem ser considerados como liquidação, afim, de limitar os valores dos pedidos por ocasião da sentença. Caso assim não entenda, requer desde já V. Exa., se digne conceder prazo para adequação dos valores, ou alterar de ofício, conforme disposto o § 3º do art. 292 do CPC.</p>
  <p>Dá-se à presente o valor de R$ ().</p>
</section>

<section style="margin-top: 40px;">
  <p>Termos em que,<br>
  D. R. A. esta, com os inclusos documentos,<br>
  Pede deferimento.</p>

  <p>São Paulo, 20 de março de 2025.</p>

  <p><strong>Renata Sanches Guilherme<br>
  OAB/SP 232.686</strong></p>
</section>


</body>
</html>
`;
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      return pdfBuffer;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  }
}
