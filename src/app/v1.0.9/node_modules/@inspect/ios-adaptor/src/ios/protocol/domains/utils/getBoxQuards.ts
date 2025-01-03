class DOMPoint {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

class DOMQuad {
  bounds: any;
  p1: DOMPoint;
  p2: DOMPoint;
  p3: DOMPoint;
  p4: DOMPoint;
  border: any;
  content: any;
  margin: any;
  padding: any;
  height: any;
  width: any;

  constructor(rect, ...rest) {
    this.bounds = rect;

    let { x, y, width, height } = rect;

    this.p1 = new DOMPoint(x, y, 0, 1);
    this.p2 = new DOMPoint(x + width, y, 0, 1);
    this.p3 = new DOMPoint(x + width, y + height, 0, 1);
    this.p4 = new DOMPoint(x, y + height, 0, 1);
  }

  toNumbers() {
    return [this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y, this.p4.x, this.p4.y];
  }
}

class DOMRect {
  left: number;
  x: number;
  top: number;
  y: number;
  width: number;
  height: number;
  right: any;
  bottom: any;

  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.left = this.x = x;
    this.top = this.y = y;
    this.width = width;
    this.height = height;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }
}

function getProps(styles, prop) {
  let props = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  Object.keys(props).forEach(side => {
    let _side = prop + '-' + side;
    let _prop = parseFloat(styles[_side]);
    if (!isNaN(_prop)) {
      props[side] = _prop;
    }
  });

  return props;
}

function buildRect(box, rect, margins, borders, paddings) {
  let x = rect.x;
  let y = rect.y;
  let width = rect.width;
  let height = rect.height;

  if (box === 'margin') {
    x -= margins.left;
    y -= margins.top;

    width += margins.left + margins.right;
    height += margins.top + margins.bottom;
  }

  if (box === 'padding') {
    x += borders.left;
    y += borders.top;

    width -= borders.left + borders.right;
    height -= borders.top + borders.bottom;
  }

  if (box === 'content') {
    x += borders.left + paddings.left;
    y += borders.top + paddings.top;

    width -= borders.left + borders.right + paddings.left + paddings.right;
    height -= borders.top + borders.bottom + paddings.top + paddings.bottom;
  }

  return new DOMRect(x, y, width, height);
}

function buildBoxQuads(nodeRect, nodeComputedStyles) {
  const margins = getProps(nodeComputedStyles, 'margin');
  const borders = getProps(nodeComputedStyles, 'border');
  const paddings = getProps(nodeComputedStyles, 'padding');

  let borderQuard = new DOMQuad(buildRect('border', nodeRect, margins, borders, paddings));
  let contentQuard = new DOMQuad(buildRect('content', nodeRect, margins, borders, paddings));
  let marginQuard = new DOMQuad(buildRect('margin', nodeRect, margins, borders, paddings));
  let paddingQuard = new DOMQuad(buildRect('padding', nodeRect, margins, borders, paddings));

  return {
    border: borderQuard.toNumbers(),
    content: contentQuard.toNumbers(),
    margin: marginQuard.toNumbers(),
    padding: paddingQuard.toNumbers(),
    width: nodeRect.width,
    height: nodeRect.height,
  };
}

export default function getBoxModel(nodeRect, nodeComputedStyles) {
  let boxQuards = buildBoxQuads(nodeRect, nodeComputedStyles);

  return {
    border: boxQuards.border,
    content: boxQuards.content,
    margin: boxQuards.margin,
    padding: boxQuards.padding,
    height: boxQuards.height,
    width: boxQuards.width,
  };
}
