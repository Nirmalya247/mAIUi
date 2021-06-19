import { Component, OnInit } from '@angular/core';
import { Layer, Network } from 'synaptic';
import * as $ from 'jquery';

@Component({
    selector: 'app-ann-regress',
    templateUrl: './ann-regress.component.html',
    styleUrls: ['./ann-regress.component.css']
})
export class AnnRegressComponent implements OnInit {
    constructor() { }
    layers = [
        [1, 1, 1],
        [1, 1, 1, 1],
        [1, 1]
    ];
    lines = Array(1);
    datax = [[{ val: 0 }, { val: 0 }, { val: 0 }]];
    datay = [[{ val: 0 }, { val: 0 }]];
    network: Network;
    learningRate = .3;
    predictMode = false;
    ngOnInit(): void {
        this.drawLines();
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
        let line = $(`#line-${ l }`);
        let div1 = $(`#but-${ i }-${ f }`);
        let div2 = $(`#but-${ i + 1 }-${ s }`);

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
        this.drawLines();
        if (l == 0) {
            if (v == 1) {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].push({ val: 0 });
            } else {
                for (var i = 0; i < this.datax.length; i++) this.datax[i].pop();
            }
        } else if (l == this.layers.length - 1) {
            if (v == 1) {
                for (var i = 0; i < this.datay.length; i++) this.datay[i].push({ val: 0 });
            } else {
                for (var i = 0; i < this.datay.length; i++) this.datay[i].pop();
            }
        }
    }
    changeLayer(v) {
        if (v == 1) {
            this.layers.splice(this.layers.length - 1, 0, [1, 1]);
        } else {
            if (this.layers.length >= 3) this.layers.splice(this.layers.length - 2, 1);
        }
        this.drawLines();
    }
    addData() {
        this.datax.push(JSON.parse(JSON.stringify(this.datax[0])));
        this.datay.push(JSON.parse(JSON.stringify(this.datay[0])));
    }
    removeData(i) {
        this.datax.splice(i, 1);
        this.datay.splice(i, 1);
    }
    createModel() {
        var layersN = [ new Layer(this.layers[0].length) ];
        for (var i = 1; i < this.layers.length; i++) {
            layersN.push(new Layer(this.layers[i].length));
            layersN[i - 1].project(layersN[i]);
        }
        var layersH = [ ];
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
        var dy = [];
        for (var i = 1; i < this.datax.length; i++) {
            var x = [];
            var y = [];
            for (var j = 0; j < this.datax[i].length; j++) x.push(Number(this.datax[i][j].val));
            for (var j = 0; j < this.datay[i].length; j++) y.push(Number(this.datay[i][j].val));
            dx.push(x);
            dy.push(y);
        }
        console.log(dx, dy);
        for (var i = 0; i < 1000; i++) {
            for (var j = 0; j < this.datax.length - 1; j++) {
                this.network.activate(dx[j]);
                this.network.propagate(this.learningRate, dy[j]);
            }
        }
    }
    predict() {
        var x = [];
        var y = [];
        for (var j = 0; j < this.datax[0].length; j++) x.push(Number(this.datax[0][j].val));
        y = this.network.activate(x);
        console.log(y);
        for (var j = 0; j < y.length; j++) y[j] = { val: y[j] };
        this.datay[0] = y;
    }
}
