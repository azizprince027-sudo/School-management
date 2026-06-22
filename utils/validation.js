function NoteValide(note) {
    const n = Number(note);
    return !isNaN(n) && n >= 0 && n <= 20;
}

function AgeValide(age) {
    const a = Number(age);
    return !isNaN(a) && a > 0 && a < 100;
}

function NonVide(texte) {
    return typeof texte === 'string' && texte.trim().length > 0;
}
module.exports = { NoteValide, AgeValide, NonVide };