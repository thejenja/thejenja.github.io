export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV !== "production") return;

  useHead({
    script: [
      {
        innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=103699281','ym');ym(103699281,'init',{webvisor:true,trackHash:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`,
        tagPosition: "bodyOpen",
      },
    ],
    noscript: [
      {
        children: `<div><img src="https://mc.yandex.ru/watch/103699281" style="position:absolute; left:-9999px;" alt="" /></div>`,
      },
    ],
    meta: [
      { name: "yandex-verification", content: "6fb57a93002b4804" },
    ],
  });
});
