export function loadSlideOnTemplateAndClone(template, slide) {
    let divs = template.content.querySelectorAll("div");

    divs[1].innerHTML = slide.headline.text;
    divs[2].innerHTML = slide.byLine.text;
    divs[4].innerHTML = slide.textBoxes[1].text;

    if (slide.type === "txtAndImg") {
        divs[3].innerHTML = `<img src="${slide.img.src}">`;
    } else {
        divs[3].innerHTML = slide.textBoxes[0].text;
    }

    applyStyle(divs[1].style, slide.headline);
    applyStyle(divs[2].style, slide.byLine);
    applyStyle(divs[3].style, slide.textBoxes[0]);
    applyStyle(divs[4].style, slide.textBoxes[1]);

    return template.content.cloneNode(true);
}

function applyStyle(dest, src) {
    dest.fontFamily = src.fontType;
    dest.fontSize = src.fontSize;
    dest.fontWeight = src.bold;
    dest.fontStyle = src.italic;
    dest.textDecoration = src.underline;
    dest.color = src.fontColor;
    dest.textAlign = src.align;
}
