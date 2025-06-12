export function formatarParaReal(valor?: number): string {
  if (valor === undefined || isNaN(valor)) return '';

  const valorFixado = valor.toFixed(2); // garante duas casas decimais
  let [inteira, decimal] = valorFixado.split('.');

  // adiciona os pontos de milhar
  inteira = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${inteira},${decimal}`;
}
