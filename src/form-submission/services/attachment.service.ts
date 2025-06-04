import { Injectable } from '@nestjs/common';
import { FormData } from '../interface/form-data';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';

@Injectable()
export class AttachmentService {
  async execute(formData: FormData) {
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

<h1>EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DA VARA DO TRABALHO DE ${formData.cidade.toUpperCase()}/UF</h1>

<p>
  [RECLAMANTE], [nacionalidade], [estado civil],portador do RG nº [XX] SSP/SP, inscrito no CPF sob o nº [XX]  e no PIS sob o nº [XX], portador da CTPS n° [XX], série [XX]/UF, filho de [nome da mãe], nascido aos [dd/mm/aaaa], residente a [Endereço], [nº], [bairro] - [cidade/UF] [(CEP XXXXX)], com contato eletrônico para recebimento de notificações através do e-mail [contato@schsch.com.br], vem, através de sua advogada abaixo assinada, à presença de V. Exa., propor:
</p>
<h2> RECLAMAÇÃO TRABALHISTA</h2>

<p>
  ${formData.reclamadas
    .map(
      (rec, index) => `
     ${index !== 0 ? `${index + 1}ª` : `a ser processada pelo RITO ORDINÁRIO, em face de`}  <span class="bold">${rec.nome}</span>, pessoa jurídica de direito privado e/ou público, devidamente inscrita no CNPJ sob o nº  ${rec.cnpj}, estabelecida na [Endereço], [nº], [bairro] - [cidade/UF] [(CEP XXXXX)], com endereço eletrônico através do e-mail: [inserir] e telefone [inserir], ${index === 0 ? `e subsidiariamente` : formData.reclamadas.length === index + 1 ? `pelos motivos de fato e de direito adiante expendidos:` : ``}`,
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
  
A parte reclamante foi contratada em ${formData.dataDispensa}, exercendo por último a função de ${formData.cargoCtps.toUpperCase()}, sob a remuneração de R$ 00,00 por mês, 
acrescido de <span class="bold">${formData.adicionais.map((adc) => adc.toUpperCase()).join('/')}</span>, sendo que o contrato foi encerrado sem justa causa em ${format(formData.dataDispensa, 'dd/MM/yyyy')}. 
</p>
<p>
  O reclamante foi admitido como ${formData.cargoCtps}, exercendo as funções de ${formData.atividadesDesempenhadas}, com salário de R$ ${formData.ultimoSalario}.
</p>

<p>Em razão do cargo, competia a parte autora as seguintes atribuições ${formData.atividadesDesempenhadas}.</p>

<h2>VARIAÇÕES</h2>
<p>
${
  formData.trabalhouSemRegistroCTPS === 'Sim'
    ? `
  <h2>SEM REGISTRO</h2>
A parte reclamante foi admitida em ${format(formData.dataAdmissaoSemRegistro, 'dd/MM/yyyy')}, sem registro em sua CTPS, exercendo por último a função de ${formData.cargoCtps.toUpperCase()}, sob a remuneração de ${formData.ultimoSalario} por mês, sendo que o contrato foi encerrado sem justa causa em ${format(formData.dataDispensa, 'dd/MM/yyyy')}`
    : ``
}
${
  formData.trabalhouSemRegistroCTPS === 'Apenas um período'
    ? `
  <h2>COM PERÍODO SEM REGISTRO </h2>
A parte reclamante foi admitida em 00/00/0000, apenas tendo sido registrada na CTPS em 00/00/0000, exercendo por último a função de ${formData.cargoCtps.toUpperCase()}, sob a remuneração de ${formData.ultimoSalario} por mês, acrescido de 30% do adicional de periculosidade e produção, sendo que o contrato foi encerrado sem justa causa em ${format(formData.dataDispensa, 'dd/MM/yyyy')}.`
    : ``
}
</p>

<p>
${
  formData.modalidadeDispensa === 'Sem justa causa' &&
  formData.avisoPrevio === 'Indenizado'
    ? `
  <h2>SEM JUSTA CAUSA – AVISO PRÉVIO INDENIZADO</h2>
O contrato de trabalho se encerrou mediante dispensa, sem justa causa, pelo empregador em ${format(formData.dataDispensa, 'dd/MM/yyyy')}, com aviso prévio indenizado ${formData.anotacaoCtpsAvisoPrevio === 'Sim' ? `, projetando seu contrato de trabalho até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy')}, nos termos da Lei 12.506/2011` : ``}.
  `
    : formData.modalidadeDispensa === 'Sem justa causa' &&
        formData.avisoPrevio === 'Trabalhado'
      ? `<h2>SEM JUSTA CAUSA – AVISO PRÉVIO TRABALHADO</h2>
O contrato de trabalho se encerrou mediante dispensa, sem justa causa, em ${format(formData.dataDispensa, 'dd/MM/yyyy')} ${
          formData.anotacaoCtpsAvisoPrevio === 'Sim'
            ? `, com aviso prévio trabalhado até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy')} e, projeção do aviso prévio indenizado até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy')}, nos termos da Lei 12.506/2011.
`
            : ``
        }.`
      : ``
}
</p>
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
    O contrato de trabalho se encerrou mediante pedido de demissão pelo empregado aos ${format(formData.dataDispensa, 'dd/MM/yyyy')}, não tendo cumprido o aviso prévio.
  </p>`
    : ''
}
${
  formData.modalidadeDispensa === 'Pedido de Demissão' &&
  formData.avisoPrevio === 'Trabalhado'
    ? `
  <h2>PEDIDO DE DEMISSÃO – AVISO PRÉVIO CUMPRIDO</h2>
  <p>
    O contrato de trabalho se encerrou mediante pedido de demissão pelo empregado aos ${format(formData.dataDispensa, 'dd/MM/yyyy')}, tendo cumprido o aviso prévio de forma trabalhada até ${format(formData.dataDispensaAvisoPrevio, 'dd/MM/yyyy')}.
  </p>`
    : ''
}
${
  formData.modalidadeDispensa === 'Justa Causa'
    ? `
  <h2>JUSTA CAUSA</h2>
  <p>
    O contrato de trabalho foi extinto mediante demissão por justa causa em ${format(formData.dataDispensa, 'dd/MM/yyyy')}, sob a alegação de <span class="bold">${formData.motivoJustaCausa || 'FALTA ATRIBUTO_MOTIVO_JUSTA_CAUSA'}</span>.
    ${formData.advertenciaJustaCausa === 'Sim' ? 'Importante destacar que o reclamante recebeu advertências prévias.' : ''}
  </p>`
    : ''
}

<h2>SEM JUSTA CAUSA – RETIFICAÇÃO DA CTPS</h2>
  <p>
      A parte reclamante foi admitida em 00/00/0000, tendo sido registrado na função de FUNÇÃO, porém, efetivamente, exercia as atribuições de FUNÇÃO desde 00/00/0000, sendo que a empregadora não procedeu a alteração tempestiva da CTPS e/ou o remunerou corretamente.
  </p>

<h2>DOIS CONTRATOS DE TRABALHO</h2>
<p>
A parte reclamante foi contratada pela empregadora em dois períodos, sendo estes:
1º contrato: de 00/00/0000 a 00/00/0000, exercendo as funções de [inserir] quando recebia o salário de R$ 00,00 mensais, acrescido de [inserir], sendo que o contrato foi encerrado mediante [dispensa sem justa causa/dispensa por justa causa/pedido de demissão].
2º contrato: de 00/00/0000 a 00/00/0000, exercendo as funções de [inserir] quando recebia o salário de R$ 00,00 mensais, acrescido de [inserir], sendo que o contrato foi encerrado mediante [dispensa sem justa causa/dispensa por justa causa/pedido de demissão].
</p>

<h2>Final do tópico - fixo:</h2>
  <p>
    Por fim, acresça-se que a parte autora teve como último local de trabalho [inserir endereço], em prol da [preenchimento manual, para caso de terceirização], sendo este o Fórum Trabalhista o competente para processar o presente feito
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
  formData.tipoResposabilidadeEmpresas === 'Outros '
    ? `
    <h3>RESPONSABILIDADE SOLIDÁRIA – subempreita</h3>
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

<h3>RESPONSABILIDADE – OUTROS</h3>
<p>
Conforme informado no formulário, ${formData.outraResponsabilidadeEmpresa}.
</p>
`
    : ``
}


<h2 class="section">DAS NULIDADES</h2>
${formData.trabalhouSemRegistroCTPS === 'Sim' && formData.seguroDesempregoSemRegistro === 'Não' ? `<h3>DA RELAÇÃO DE EMPREGO – RECONHECIMENTO DE VÍNCULO EMPREGATÍCIO - VERBAS SALARIAIS E RESCISÓRIAS</h3>` : ``}
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

${formData.acordoEmpresa === 'Sim' ? `<h3>DA NULIDADE DO “ACORDO” FORMULADO NA COMISSÃO DE CONCILIAÇÃO PRÉVIA</h3>` : ``}

<p>
Após a dispensa, no ato da homologação da rescisão contratual, a Reclamada se comprometeu a proceder o pagamento ${formData.acordoEmpresa === 'Sim' && formData.valorAcordo ? formData.valorAcordo : ``}. 
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
Repetindo, o valor aproximado de ${formData.valorAcordo ? formData.valorAcordo : `[repercutir valor do acordo]`} pago pela primeira reclamada nesse negócio jurídico é IRRISÓRIO e ÍNFIMO frente ao valor que o reclamante faz jus, causando uma ruptura do equilíbrio contratual. Ademais, vale ressaltar a inexperiência do obreiro, pois não tinha conhecimentos técnicos ou habilidades relativas à natureza da transação. 
</p>


<p>
Portanto, levando-se em conta que a manifestação de vontade do reclamante não era <span class="bold">LIVRE</span> no momento da realização daquela transação, o acordo extrajudicial firmado entre o reclamante e a primeira reclamada deve ser <span class="bold">ANULADO</span>, em razão da <span class="bold">lesão</span>, nos termos do art. 171, II do Código Civil.
</p>

<h2 class="section">DA COAÇÃO</h2>

<p>
Como dito, após a dispensa, a Reclamada se comprometeu a proceder o pagamento da produção e das horas extras dos últimos meses devidas ao obreiro, condicionando, entretanto, o pagamento ao comparecimento do Reclamante perante a Comissão de Conciliação Prévia, para realização de um “acordo”.
</p>

<p>
Naquela oportunidade, com um valor já previamente determinado, sem possibilidade de negociação, foi informado que lhe seria pago um valor para reembolsá-lo de descontos indevidos e horas extras relativas ao último mês de trabalho. No entanto, para que lhe fosse paga a mencionada quantia, obrigatoriamente deveria assinar alguns documentos, consistentes num “acordo” proposto, cujo respectivo valor não guarda qualquer proporção entre o valor devido e o recebido pelo obreiro, eis que recebera o ínfimo valor aproximado de <span class="bold">${formData.valorAcordo ? formData.valorAcordo : `[repercutir valor do acordo]`}</span>.
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

${formData.modalidadeDispensa === 'Outros' && formData.teveAnotacaoCtps === 'Não' ? `<h3>NULIDADE DE CONTRATO TEMPORÁRIO / NULIDADE DO CONTRATO POR PRAZO DETERMINADO</h3>` : ``}

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
${
  formData.condicoes.includes('Gestante')
    ? `
<h3>NULIDADE DA DISPENSA – EMPREGADA GRÁVIDA</h3>
<p>
A reclamante foi dispensada quando se encontrava grávida, conforme documentação em anexo, motivo pelo qual, diante do disposto no artigo 10, II, letra “b” do ADCT, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração da obreira, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável ou indevida a reintegração (Súmula 244, do C.TST), seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}

${
  formData.condicoes.includes(
    'Dentro do período de estabilidade do acidente/doença? (12 meses após a alta médica)',
  )
    ? `
<h3>NULIDADE DA DISPENSA – EMPREGADO ACIDENTADO</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que sofreu acidente de trabalho/foi acometido por doença profissional, tendo recebido alta em xx/xx/xx, motivo pelo qual, diante do disposto no artigo 118 da Lei 8.213/91 (cuja constitucionalidade já foi reconhecida na Súmula 378, do C.TST), deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>

<h3>NULIDADE DA DISPENSA – DOENTE</h3>
<p>
Por ocasião da dispensa, o reclamante encontrava-se enfermo e, portanto, deveria estar em gozo de auxílio doença com seu contrato de trabalho suspenso. Desta forma, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período entre o desligamento e a recuperação da capacidade laborativa, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}
${
  formData.condicoes.includes('Cipeiro')
    ? `
<h3>NULIDADE DA DISPENSA – CIPEIRO</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que foi eleito, em xx/xx/xx, para desempenhar mandato na CIPA. Assim, diante do disposto no artigo 165, da CLT e da Súmula 339, do C.TST, deve ser declarada a nulidade do ato de dispensa, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
</p>
  `
    : ``
}
${
  formData.condicoes.includes('Dirigente sindical')
    ? `
<h3>NULIDADE DA DISPENSA – DIRIGENTE SINDICAL</h3>
<p>
O reclamante foi dispensado em período estabilitário, eis que foi eleito, em xx/xx/xx, para desempenhar as funções de xxx no sindicato xxxx. Assim, diante do disposto no artigo 543, parágrafo 3º, da CLT, deve ser declarada a nulidade do ato de dispensa, que não observou o disposto na Súmula 379, do C.TST, determinando-se a reintegração do obreiro, com pagamento dos salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e depósito de FGTS do período de afastamento ou, caso Vossa Excelência entenda desaconselhável a reintegração, seja deferido o pagamento de indenização do período estabilitário, consistente em salários e todas as demais verbas salariais habitualmente pagas, 13º salário, férias + 1/3 e FGTS + 40%.
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


<p>
</p>

<p>
</p>


</body>
</html>
`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  }
}
