'use client';

import { useRef } from "react";
import ReactLenis, { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroImgElementRef = useRef<HTMLImageElement>(null);
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroGridOverlayRef = useRef<HTMLDivElement>(null);
  const marker1Ref = useRef<HTMLDivElement>(null);
  const marker2Ref = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(() => {
    const heroContent = heroContentRef.current;
    const heroImg = heroImgRef.current;
    const heroImgElement = heroImgElementRef.current;
    const heroMask = heroMaskRef.current;
    const heroGridOverlay = heroGridOverlayRef.current;
    const marker1 = marker1Ref.current;
    const marker2 = marker2Ref.current;
    const progressBar = progressBarRef.current;
    const container = containerRef.current;

    if (
      !heroContent ||
      !heroImg ||
      !heroImgElement ||
      !heroMask ||
      !heroGridOverlay ||
      !marker1 ||
      !marker2 ||
      !progressBar ||
      !container
    ) {
      return;
    }

    // Pre-set initial states explicitly
    gsap.set([heroGridOverlay, marker1, marker2], { opacity: 0 });

    const heroContentMovedistance = heroContent.offsetHeight - window.innerHeight;
    const heroImgMovedistance = heroImg.offsetHeight - window.innerHeight;
    const ease = (x: number) => x * x * (3 - 2 * x);

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${window.innerHeight * 4}px`,
      pin: container,
      scrub: 1,
      markers: true,
      onUpdate: (self) => {
        gsap.set(progressBar, {
          "--progress": self.progress,
        });

    // Define the target Y displacement at the exact moment freezing begins (progress = 0.45)
        const frozenProgress = ease(1) * 0.65; // ~0.65 of total move distance
        const frozenY = frozenProgress * heroImgMovedistance;

        let heroImgY = 0;
        // Translate the scrolling text container
        gsap.set(heroContent, {
          y: -self.progress * heroContentMovedistance,
        });
        if (self.progress <= 0.65) {
          // Absolutely ZERO movement before 0.65 (0.0 to 0.65)
          heroImgY = 0;

        } else {
          // Smoothly move the image from 0 to full distance between 0.65 and 1.0
          const normalizedProgress = (self.progress - 0.65) / 0.35; // Maps 0.65->1.0 to 0.0->1.0
          const smoothedProgress = ease(normalizedProgress);

          heroImgY = smoothedProgress * heroImgMovedistance;
        }

        gsap.set(heroImg, {
          y: heroImgY,
        });

        // Mask scale & image filters
        let heroMaskScale;
        let heroImgSaturation;
        let heroImgOverlayOpacity;

        if (self.progress <= 0.4) {
          heroMaskScale = 2.5;
          heroImgSaturation = 1;
          heroImgOverlayOpacity = 0.35;
        } else if (self.progress <= 0.5) {
          const phaseProgress = ease((self.progress - 0.4) / 0.1);
          heroMaskScale = 2.5 - phaseProgress * 1.5;
          heroImgSaturation = 1 - phaseProgress;
          heroImgOverlayOpacity = 0.35 + phaseProgress * 0.35;
        } else if (self.progress <= 0.75) {
          heroMaskScale = 1;
          heroImgSaturation = 0;
          heroImgOverlayOpacity = 0.7;
        } else if (self.progress <= 0.85) {
          const phaseProgress = ease((self.progress - 0.75) / 0.1);
          heroMaskScale = 1 + phaseProgress * 1.5;
          heroImgSaturation = phaseProgress;
          heroImgOverlayOpacity = 0.7 - phaseProgress * 0.35;
        } else {
          heroMaskScale = 2.5;
          heroImgSaturation = 1;
          heroImgOverlayOpacity = 0.35;
        }

        gsap.set(heroMask, { scale: heroMaskScale });
        gsap.set(heroImgElement, { filter: `saturate(${heroImgSaturation})` });
        gsap.set(heroImg, { "--overlay-opacity": heroImgOverlayOpacity });

        // Grid opacity
        let heroGridOpacity;
        if (self.progress <= 0.475) {
          heroGridOpacity = 0;
        } else if (self.progress <= 0.5) {
          heroGridOpacity = ease((self.progress - 0.475) / 0.025);
        } else if (self.progress <= 0.75) {
          heroGridOpacity = 1;
        } else if (self.progress <= 0.775) {
          heroGridOpacity = 1 - ease((self.progress - 0.75) / 0.025);
        } else {
          heroGridOpacity = 0;
        }

        gsap.set(heroGridOverlay, { opacity: heroGridOpacity });

        // Marker 1 opacity
        let marker1Opacity;
        if (self.progress <= 0.5) {
          marker1Opacity = 0;
        } else if (self.progress <= 0.525) {
          marker1Opacity = ease((self.progress - 0.5) / 0.025);
        } else if (self.progress <= 0.7) {
          marker1Opacity = 1;
        } else if (self.progress <= 0.75) {
          marker1Opacity = 1 - ease((self.progress - 0.7) / 0.05);
        } else {
          marker1Opacity = 0;
        }

        gsap.set(marker1, { opacity: marker1Opacity });

        // Marker 2 opacity
        let marker2Opacity;
        if (self.progress <= 0.55) {
          marker2Opacity = 0;
        } else if (self.progress <= 0.575) {
          marker2Opacity = ease((self.progress - 0.55) / 0.025);
        } else if (self.progress <= 0.7) {
          marker2Opacity = 1;
        } else if (self.progress <= 0.75) {
          marker2Opacity = 1 - ease((self.progress - 0.7) / 0.05);
        } else {
          marker2Opacity = 0;
        }

        gsap.set(marker2, { opacity: marker2Opacity });
      },
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, { scope: containerRef });

  return (
    <>
      <ReactLenis root />
      <main className="container">
        <section ref={containerRef} className="hero">
          {/* Background Visual Layer */}
          <article>
            <div ref={heroImgRef} className="hero-img">
              <img
                ref={heroImgElementRef}
                src="/aerial-urban-rooftops-dense.jpg"
                alt=""
              />
            </div>

            <div ref={heroMaskRef} className="hero-mask"></div>

            <div ref={heroGridOverlayRef} className="hero-grid-overlay">
              <img src="/grid.svg" alt="Grid" />
            </div>

            <aside ref={marker1Ref} className="marker marker-1">
              <span className="marker-icon"></span>
              <p className="marker-label">Anchor Field</p>
            </aside>

            <aside ref={marker2Ref} className="marker marker-2">
              <span className="marker-icon"></span>
              <p className="marker-label">Drift Field</p>
            </aside>
          </article>

          {/* Foreground Scrollable Content */}
          <div ref={heroContentRef} className="hero-content">
            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Active Locations</h2>
                <p>
                  Key points are indexed within the field. Each location functions as a reference for spatial alignment and transition logic.
                </p>
              </div>
            </div>

            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Spatial Center</h2>
                <p>
                  The system converges toward a balanced focal region. Motion decelerates as positional variance reaches equilibrium.
                </p>
              </div>
            </div>

            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Perimeter Watch</h2>
                <p>
                  Outer boundaries are monitored in real time. Sensor arrays flag intrusion vectors before contact reaches the defensive line.
                </p>
              </div>
            </div>

            <div className="hero-content-block">
              <div className="hero-content-copy">
                <h2>Command Relay</h2>
                <p>
                  Field units transmit status through a hardened relay chain. Priority signals override standard queueing during active engagement.
                </p>
              </div>
            </div>
          </div>

          <div ref={progressBarRef} className="hero-scroll-progress-bar"></div>
        </section>
      </main>

      <footer className="outro">
        <p>The journey reached its final destination</p>
      </footer>
    </>
  );
}
