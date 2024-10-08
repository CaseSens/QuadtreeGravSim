
import Body from "./body";
import Vector from "./vector";

export default class TreeNode {
  x: number;
  y: number;
  w: number;
  children: TreeNode[];
  leaf: boolean;
  body: Body | null;

  totalCenter: Vector; // "Total" center of mass
  center: Vector | null;
  totalMass: number;
  count: number; // Number of bodies in this node

  constructor(x: number, y: number, w: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.leaf = true;
    this.body = null;
    this.children = new Array<TreeNode>(4);

    this.totalCenter = new Vector(0, 0);
    this.center = null;
    this.totalMass = 0;
    this.count = 0;
  }

  split() {
    const newWidth = this.w * 0.5;
    this.children[0] = new TreeNode(this.x, this.y, newWidth); // nw
    this.children[1] = new TreeNode(this.x + newWidth, this.y, newWidth); // ne
    this.children[2] = new TreeNode(this.x, this.y + newWidth, newWidth); // sw
    this.children[3] = new TreeNode(
      this.x + newWidth,
      this.y + newWidth,
      newWidth
    ); // se
    this.leaf = false;
  }

  which(v: Vector): number {
    const halfWidth = this.w * 0.5;
    if (v.y < this.y + halfWidth) {
      return v.x < this.x + halfWidth ? 0 : 1;
    }

    return v.x < this.x + halfWidth ? 2 : 3;
  }

  insert(newBody: Body) {
    if (this.leaf) {
      // If not already contains body, add it and adjust total center and mass
      if (!this.body) {
        this.body = newBody;
        this.totalCenter.add(newBody.pos);
        this.totalMass += newBody.mass;
        this.count++;
        return;
      }

      // Otherwise, split and insert current & new body into individual nodes
      const a = this.body;
      const b = newBody;

      this.totalCenter.add(b.pos);
      this.totalMass += b.mass;
      this.count++;

      let cur = this as TreeNode;
      let qA = cur.which(a.pos);
      let qB = cur.which(b.pos);

      while (qA == qB) {
        cur.split();
        cur = cur.children[qA];
        qA = cur.which(a.pos);
        qB = cur.which(b.pos);

        // Update total center and mass
        cur.totalCenter.add(a.pos);
        cur.totalCenter.add(b.pos);
        cur.totalMass += a.mass + b.mass;
        cur.count += 2;
      }

      cur.split();
      cur.children[qA].body = a;
      cur.children[qB].body = b;

      // Update center of mass and total for lowest-level child
      cur.children[qA].totalCenter.add(a.pos);
      cur.children[qB].totalCenter.add(b.pos);
      cur.children[qA].totalMass += a.mass;
      cur.children[qB].totalMass += b.mass;
      cur.children[qA].count++;
      cur.children[qB].count++;

      this.body = null;
      return;
    }

    // If it's not a leaf, insert new body into this node
    this.totalCenter.add(newBody.pos);
    this.totalMass += newBody.mass;
    this.count++;
    this.children[this.which(newBody.pos)].insert(newBody);
  }
}
