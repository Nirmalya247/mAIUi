import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Layer, Network } from 'synaptic';
import * as $ from 'jquery';
import * as $mixColors from 'mix-colors'
import * as $color from 'color';
import { mShape } from './mShape';

@Component({
    selector: 'app-ann-graph',
    templateUrl: './ann-graph.component.html',
    styleUrls: ['./ann-graph.component.css']
})
export class AnnGraphComponent implements OnInit {
    constructor() { }
    @ViewChild('canv', { static: true })
    canv: ElementRef<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;


    layers = [
        [1, 1],
        [1, 1, 1, 1],
        [1, 1]
    ];
    lines = Array(1)
    colors = [
        'red', 'green', 'blue', 'orange', 'yellow', 'purple'
    ];
    size = 8;
    selectedColor = 0;
    datax = [];
    datay = [];
    network: Network;
    learningRate = .3;
    predictMode = false;
    ngOnInit(): void {
        this.drawLines();
    }
    ngAfterViewInit(): void {
        this.context = this.canv.nativeElement.getContext('2d');
        this.onResize(null);
    }
    onResize(e) {
        var width = $('.data-parent').outerWidth();
        var height = $('.data-parent').outerHeight();
        this.canv.nativeElement.width = width - 2;
        this.canv.nativeElement.height = height - 2;
        this.drawPoints(null, null, null);
        this.drawLines();
    }
    selectNode(l, n) {
        if (l == this.layers.length - 1) this.selectedColor = n;
    }
    addPoint(e) {
        var x = e.offsetX;
        var y = e.offsetY;
        if (!this.predictMode) {
            var color = this.selectedColor;
            this.datax.push([x, y]);
            var datay = Array.from({ length: this.layers[this.layers.length - 1].length }, () => 0);
            datay[color] = 1;
            this.datay.push(datay);
            this.drawPoints(null, null, null);
        } else {
            this.predict(x, y);
        }
    }
    drawPoints(x, y, c) {
        this.paintMode = false;
        this.context.clearRect(0, 0, this.canv.nativeElement.width, this.canv.nativeElement.height);
        for (var i = 0; i < this.datax.length; i++) {
            this.context.fillStyle = this.colors[this.datay[i].findIndex(t => t == 1)];
            const square = new mShape(this.context);
            square.draw(this.datax[i][0] - this.size / 2, this.datax[i][1] - this.size / 2, this.size);
            // console.log(this.datax[i], this.datay[i]);
        }
        if (x) {
            this.context.fillStyle = this.colors[c];
            const square = new mShape(this.context);
            square.draw(x - this.size / 2, y - this.size / 2, this.size);
            // console.log(this.datax[i], this.datay[i])
        }
        // var c1 = $color('red');
        // var c2 = $color('green')
        // var c3 = $mixColors([c1.hex(), c2.hex()]);
        // var c4 = $mixColors(['#FF00000F', '#008000'])
        // console.log(c1.rgb().array(), c2.hex(), c3);
        if (this.predictMode) {
        }
    }

    drawLines() {
        var n = 0;
        for (var i = 0; i < this.layers.length - 1; i++) {
            n += this.layers[i].length * this.layers[i + 1].length;
        }
        this.lines = Array(n);

        setTimeout(() => {
            var l = 0;
            for (var i = 0; i < this.layers.length - 1; i++) {
                for (var f = 0; f < this.layers[i].length; f++) {
                    for (var s = 0; s < this.layers[i + 1].length; s++, l++) this.drawLine(i, f, s, l);
                }
            }
        }, 1);
    }
    drawLine(i, f, s, l) {
        let svg = $(`.svg-parent`);
        let line = $(`#line-${l}`);
        let div1 = $(`#but-${i}-${f}`);
        let div2 = $(`#but-${i + 1}-${s}`);

        var x1 = div1.offset().left + div1.outerWidth() - svg.offset().left;
        var y1 = div1.offset().top + (div1.outerHeight() / 2) - svg.offset().top;
        var x2 = div2.offset().left - svg.offset().left;
        var y2 = div2.offset().top + (div2.outerHeight() / 2) - svg.offset().top;

        line.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);
    }
    changeNode(v, l) {
        if (v == 1) {
            if ((l == 0 && this.layers[l].length < 2) || (l == this.layers.length - 1 && this.layers[l].length < 6) || (l > 0 && l < this.layers.length - 1)) this.layers[l].push(1);
            else return;
        } else {
            if (this.layers[l].length >= 2) this.layers[l].pop();
            else return;
        }
        if (l == 0) {
            if (v == 1) {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].push(0);
            } else if (v == -1) {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].pop();
            }
        } else if (l == this.layers.length - 1) {
            if (v == 1) {
                for (var i = 0; i < this.datay.length; i++) this.datay[i].push(0);
            } else if (v == -1) {
                for (var i = 0; i < this.datay.length; i++) {
                    this.datay[i].pop();
                    if (this.datay[i].findIndex(t => t == 1) < 0) {
                        this.datax.splice(i, 1);
                        this.datay.splice(i, 1);
                        i--;
                    }
                }
                this.selectedColor = 0;
            }
        }
        this.drawLines();
        this.drawPoints(null, null, null);
    }
    changeLayer(v) {
        if (v == 1) {
            this.layers.splice(this.layers.length - 1, 0, [1, 1]);
        } else {
            if (this.layers.length >= 3) this.layers.splice(this.layers.length - 2, 1);
        }
        this.drawLines();
        this.drawPoints(null, null, null);
    }


    createModel() {
        var layersN = [new Layer(this.layers[0].length)];
        for (var i = 1; i < this.layers.length; i++) {
            layersN.push(new Layer(this.layers[i].length));
            layersN[i - 1].project(layersN[i]);
        }
        var layersH = [];
        for (var i = 1; i < this.layers.length - 1; i++) {
            layersH.push(layersN[i]);
        }
        this.network = new Network({
            input: layersN[0],
            hidden: layersH,
            output: layersN[this.layers.length - 1]
        });
    }
    train() {
        this.createModel();
        var dx = [];
        for (var i = 0; i < this.datax.length; i++) {
            dx.push([this.datax[i][0] / this.canv.nativeElement.width, this.datax[i][1] / this.canv.nativeElement.height]);
        }
        for (var i = 0; i < 1000; i++) {
            for (var j = 0; j < this.datax.length; j++) {
                this.network.activate(dx[j]);
                this.network.propagate(this.learningRate, this.datay[j]);
            }
        }
        // console.log(this.datax, this.datay);
    }
    predict(x, y) {
        var dx = [x / this.canv.nativeElement.width, y / this.canv.nativeElement.height];
        var dy = [];
        dy = this.network.activate(dx);
        var color = dy.findIndex(t => t >= 0.5);
        console.log(dy, color);
        this.drawPoints(x, y, color);
    }

    paintMode = false;
    paintPrediction() {
        if (!this.paintMode) {
            var w = this.canv.nativeElement.width;
            var h = this.canv.nativeElement.height;
            for (var xi = 0; xi < w; xi++) {
                for (var yi = 0; yi < h; yi++) {
                    var dx = [xi / this.canv.nativeElement.width, yi / this.canv.nativeElement.height];
                    var dy = this.network.activate(dx);
                    var cn = [0, 0, 0];
                    for (var ci = 0; ci < dy.length; ci++) {
                        var tc = $color(this.colors[ci]).rgb().array();
                        cn[0] += tc[0] * dy[ci];
                        cn[1] += tc[1] * dy[ci];
                        cn[2] += tc[2] * dy[ci];
                        // console.log(tc[0], dy);
                    }
                    cn[0] /= dy.length;
                    cn[1] /= dy.length;
                    cn[2] /= dy.length;
                    cn = $color(cn).lighten(0.8).hex();
                    this.context.fillStyle = cn.toString();
                    this.context.fillRect(xi, yi, 1, 1);
                }
            }
        } else this.drawPoints(null, null, null);
        this.paintMode = !this.paintMode;
    }
}
