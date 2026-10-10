/** Before-paint counterpart to the app-root preference restore; only known IDs reach the DOM. */
export function themePreferenceScript(variants: readonly string[]): string {
  return `(()=>{
    const variants=${JSON.stringify(variants)};
    const parse=value=>{
      if(value==='light-soft')value='light-paper';
      if(value==='dark-soft')value='dark-paper';
      return variants.includes(value)?value:null;
    };
    let stored=null,theme=null;
    try{
      stored=localStorage.getItem('lig-palette-variant');
      theme=localStorage.getItem('kit-theme');
    }catch{}
    const fallback=theme==='light'||theme==='dark'?theme:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    const variant=parse(new URLSearchParams(location.search).get('variant'))||parse(stored)||fallback;
    document.documentElement.dataset.theme=variant.startsWith('dark')?'dark':'light';
    document.documentElement.dataset.ligVariant=variant;
  })()`
}
