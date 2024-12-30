// place files you want to import through the `$lib` alias in this folder.
export const getSlug = (s => {
    return s.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
});
