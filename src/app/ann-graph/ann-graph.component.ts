import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Layer, Network } from 'synaptic';
import * as $ from 'jquery'
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
    drawPoints(x, y, color) {
        this.context.clearRect(0, 0, this.canv.nativeElement.width, this.canv.nativeElement.height);
        for (var i = 0; i < this.datax.length; i++) {
            this.context.fillStyle = this.colors[this.datay[i].findIndex(t => t == 1)];
            const square = new mShape(this.context);
            square.draw(this.datax[i][0] - this.size / 2, this.datax[i][1] - this.size / 2, this.size);
            // console.log(this.datax[i], this.datay[i]);
        }
        if (x) {
            this.context.fillStyle = color;
            const square = new mShape(this.context);
            square.draw(x - this.size / 2, y - this.size / 2, this.size);
            // console.log(this.datax[i], this.datay[i])
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
            this.layers[l].push(1);
        } else {
            if (this.layers[l].length >= 2) this.layers[l].pop();
            else return;
        }
        if (l == 0) {
            if (v == 1) {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].push(0);
            } else {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].pop();
            }
        } else if (l == this.layers.length - 1) {
            if (v == 1) {
                for (var i = 0; i < this.datay.length; i++) this.datay[i].push(0);
            } else {
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
        for (var i = 0; i < 1000; i++) {
            for (var j = 0; j < this.datax.length - 1; j++) {
                this.network.activate(this.datax[j]);
                this.network.propagate(this.learningRate, this.datay[j]);
            }
        }
    }
    predict(x, y) {
        var dx = [x, y];
        var dy = [];
        dy = this.network.activate(dx);
        console.log(dy);
        var color = dy.findIndex(t => t == 1);
        this.drawPoints(x, y, color);
    }
}
