// Taken from https://bl.ocks.org/mbostock/157333662ef11c151080
import * as d3 from "d3";

/**
 * @name createParticles
 * @description Main function that runs the d3 visualization.
 */
function createParticles() {
    var width = d3.select("header").node().getBoundingClientRect().width,
        height = d3.select("header").node().getBoundingClientRect().height;

    var canvas = d3
        .select("#canvas-particles")
        .attr("width", width)
        .attr("height", height)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed("svg-content", true),
        context = canvas.node().getContext("2d"),
        width = canvas.node().width,
        height = canvas.node().height,
        radius = 2.5,
        minDistance = 40,
        maxDistance = 60,
        minDistance2 = minDistance * minDistance,
        maxDistance2 = maxDistance * maxDistance;

    var tau = 2 * Math.PI,
        n = Math.ceil(width * 0.13),
        particles = new Array(n);

    for (var i = 0; i < n; ++i) {
        particles[i] = {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
        };
    }

    d3.timer(function (elapsed) {
        context.save();
        context.clearRect(0, 0, width * 2, height * 2);

        for (var i = 0; i < n; ++i) {
            var p = particles[i];
            p.x += p.vx;
            if (p.x < -maxDistance) p.x += width + maxDistance * 2;
            else if (p.x > width + maxDistance) p.x -= width + maxDistance * 2;
            p.y += p.vy;
            if (p.y < -maxDistance) p.y += height + maxDistance * 2;
            else if (p.y > height + maxDistance)
                p.y -= height + maxDistance * 2;
            p.vx += 0.2 * (Math.random() - 0.5) - 0.01 * p.vx;
            p.vy += 0.2 * (Math.random() - 0.5) - 0.01 * p.vy;
            context.beginPath();
            context.arc(p.x, p.y, radius, 0, tau);
            context.fillStyle = "#06d42c";
            context.fill();
        }

        for (var i = 0; i < n; ++i) {
            for (var j = i + 1; j < n; ++j) {
                var pi = particles[i],
                    pj = particles[j],
                    dx = pi.x - pj.x,
                    dy = pi.y - pj.y,
                    d2 = dx * dx + dy * dy;
                if (d2 < maxDistance2) {
                    context.globalAlpha =
                        d2 > minDistance2
                            ? (maxDistance2 - d2) /
                            (maxDistance2 - minDistance2)
                            : 1;
                    context.beginPath();
                    context.moveTo(pi.x, pi.y);
                    context.lineTo(pj.x, pj.y);
                    context.strokeStyle = "#05961f";
                    context.stroke();
                }
            }
        }

        context.restore();
    });
}

export { createParticles };
