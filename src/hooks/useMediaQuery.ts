import { useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
   const [matches, setMatches] = useState(false);

   useEffect(() => {
      const media = window.matchMedia(query);
      // Возвращает объект MediaQueryList c строкой такого же формата как и query
      console.log(media)
      if (media.matches !== matches) {
         setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);
      // если пользователь, например, изменит размер окна, вызывается listener, который обновит matches.
      return () => media.removeEventListener("change", listener);
   }, [query]);

   return matches;
}
