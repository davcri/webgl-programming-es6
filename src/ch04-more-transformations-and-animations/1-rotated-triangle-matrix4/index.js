import WebGLApp from '../../libs/mgu/webgl-app.js';
import Vector4 from '../../libs/mgu/vector4.js';
import Matrix4 from '../../libs/cuon-matrix.js';

class App extends WebGLApp {
  ready() {
    // triangle data
    this.position = new Vector4(0.0, 0.4, 0.0);
    this.movement = new Vector4(1, 0);
    this.zRotation = 25; // degree
    this.speed = 100;
    const points = new Float32Array([
      0.0, 0.06, -0.1, -0.1, 0.1, -0.1,
    ]);
    this.xformMatrix = new Matrix4();
    this.xformMatrix.setRotate(this.zRotation, 0, 0, 1);

    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT); // clear

    const a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
    if (a_Position < 0) {
      console.error('Failed to get attribute');
    }

    this.u_xformMatrix = this.gl.getUniformLocation(this.gl.program, 'u_xformMatrix');
    if (this.u_xformMatrix < 0) {
      console.error('Failed to get u_xformMatrix');
    }

    this.gl.uniformMatrix4fv(this.u_xformMatrix, false, this.xformMatrix.elements);

    // step 1 - create the buffer
    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    // step 2 - bind the buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    // step 3 - write data into the buffer
    this.gl.bufferData(this.gl.ARRAY_BUFFER, points, this.gl.STATIC_DRAW);
    // step 4 - assign the buffer object to an attribute variable
    this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
    // step 5 - enable the assignment
    this.gl.enableVertexAttribArray(a_Position);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  process() {
    // update triangle rotation
    this.zRotation += this.delta * this.speed;
    if (this.zRotation > 360) this.zRotation = 0;
    // update xformMatrix
    this.xformMatrix.setRotate(this.zRotation, 0, 0, 1);
    // update xformMatrix uniform
    this.gl.uniformMatrix4fv(this.u_xformMatrix, false, this.xformMatrix.elements);
    // clear and draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const app = new App();
app.start();
