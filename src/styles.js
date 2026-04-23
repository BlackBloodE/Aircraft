export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#050a0f;color:#00ff9d;font-family:'Share Tech Mono',monospace;}
  .app{min-height:100vh;background:#050a0f;position:relative;overflow:hidden;}
  .grid{position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,157,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,157,.04) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0;}
  .wrap{position:relative;z-index:2;max-width:860px;margin:0 auto;padding:28px 18px;}

  /* Header */
  .hdr{text-align:center;margin-bottom:28px;position:relative;}
  .hdr-badge{display:inline-block;border:1px solid rgba(0,255,157,.3);padding:3px 12px;font-size:9px;letter-spacing:4px;color:rgba(0,255,157,.5);margin-bottom:12px;text-transform:uppercase;}
  h1{font-family:'Orbitron',monospace;font-size:clamp(20px,5vw,38px);font-weight:900;letter-spacing:6px;text-transform:uppercase;color:#00ff9d;text-shadow:0 0 30px rgba(0,255,157,.5);line-height:1.2;}
  .sub{font-size:10px;color:rgba(0,255,157,.4);letter-spacing:3px;margin-top:8px;text-transform:uppercase;}
  .gear{position:absolute;top:0;right:0;background:transparent;border:1px solid rgba(0,255,157,.2);color:rgba(0,255,157,.5);width:36px;height:36px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .25s;}
  .gear:hover,.gear.on{border-color:rgba(0,255,157,.6);color:#00ff9d;background:rgba(0,255,157,.06);}

  /* Settings panel */
  .spanel{border:1px solid rgba(0,255,157,.2);background:rgba(2,12,7,.97);margin-bottom:20px;animation:fadein .2s ease;}
  .spanel-hdr{background:rgba(0,255,157,.05);border-bottom:1px solid rgba(0,255,157,.1);padding:12px 18px;display:flex;align-items:center;justify-content:space-between;}
  .spanel-title{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;text-transform:uppercase;}
  .spanel-close{background:transparent;border:none;color:rgba(0,255,157,.4);cursor:pointer;font-size:20px;line-height:1;padding:0 2px;transition:color .2s;}
  .spanel-close:hover{color:#00ff9d;}
  .stabs{display:flex;border-bottom:1px solid rgba(0,255,157,.1);}
  .stab{flex:1;padding:10px;background:transparent;border:none;color:rgba(0,255,157,.35);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;transition:all .2s;border-bottom:2px solid transparent;text-transform:uppercase;}
  .stab:hover{color:rgba(0,255,157,.7);}
  .stab.on{color:#00ff9d;border-bottom-color:#00ff9d;}
  .stab-body{padding:18px;}

  /* Model list */
  .mitem{display:flex;align-items:center;gap:12px;padding:11px 13px;border:1px solid rgba(0,255,157,.08);margin-bottom:8px;cursor:pointer;transition:all .2s;background:transparent;width:100%;text-align:left;}
  .mitem:last-child{margin-bottom:0;}
  .mitem:hover{border-color:rgba(0,255,157,.28);background:rgba(0,255,157,.025);}
  .mitem.sel{border-color:#00ff9d;background:rgba(0,255,157,.055);}
  .mradio{width:13px;height:13px;border:1px solid rgba(0,255,157,.35);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .mitem.sel .mradio{border-color:#00ff9d;}
  .mrdot{width:5px;height:5px;border-radius:50%;background:#00ff9d;display:none;}
  .mitem.sel .mrdot{display:block;}
  .minfo{flex:1;min-width:0;}
  .mnrow{display:flex;align-items:center;gap:7px;margin-bottom:3px;flex-wrap:wrap;}
  .mname{font-family:'Orbitron',monospace;font-size:11px;font-weight:600;color:#00ff9d;}
  .mprov{font-size:9px;color:rgba(0,255,157,.4);letter-spacing:1px;}
  .mbadge{font-size:8px;padding:2px 5px;font-weight:700;letter-spacing:1px;}
  .mdesc{font-size:10px;color:rgba(0,255,157,.4);}
  .mqdots{display:flex;gap:3px;margin-top:5px;}
  .mqdot{width:5px;height:5px;border-radius:50%;background:rgba(0,255,157,.18);}
  .mqdot.on{background:#00ff9d;}
  .mno-key{display:flex;align-items:center;gap:6px;font-size:9px;color:rgba(255,160,0,.7);margin-top:4px;}

  /* API Key inputs */
  .keyblock{margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid rgba(0,255,157,.07);}
  .keyblock:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
  .keylabel{font-size:9px;letter-spacing:3px;color:rgba(0,255,157,.45);text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;}
  .keylabel a{color:rgba(0,255,157,.5);text-decoration:none;font-size:9px;border:1px solid rgba(0,255,157,.2);padding:2px 7px;transition:all .2s;}
  .keylabel a:hover{color:#00ff9d;border-color:rgba(0,255,157,.5);}
  .keyrow{display:flex;gap:8px;}
  .keyinput{flex:1;background:rgba(0,255,157,.03);border:1px solid rgba(0,255,157,.15);color:#00ff9d;font-family:'Share Tech Mono',monospace;font-size:11px;padding:9px 12px;outline:none;transition:border-color .2s;letter-spacing:.5px;}
  .keyinput:focus{border-color:rgba(0,255,157,.5);}
  .keyinput::placeholder{color:rgba(0,255,157,.2);}
  .keysave{padding:9px 14px;background:transparent;border:1px solid rgba(0,255,157,.3);color:rgba(0,255,157,.6);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;transition:all .2s;white-space:nowrap;}
  .keysave:hover{border-color:#00ff9d;color:#00ff9d;background:rgba(0,255,157,.05);}
  .keystatus{font-size:9px;margin-top:5px;letter-spacing:1px;}
  .keystatus.ok{color:rgba(0,255,157,.6);}
  .keystatus.empty{color:rgba(255,160,0,.6);}
  .keyclear{background:transparent;border:none;color:rgba(255,80,80,.4);font-family:'Share Tech Mono',monospace;font-size:9px;cursor:pointer;padding:0;transition:color .2s;margin-top:4px;}
  .keyclear:hover{color:rgba(255,80,80,.8);}

  /* Current model bar */
  .curmodel{display:flex;align-items:center;gap:8px;padding:8px 14px;background:rgba(0,255,157,.03);border:1px solid rgba(0,255,157,.1);margin-bottom:20px;font-size:10px;color:rgba(0,255,157,.5);cursor:pointer;transition:all .2s;}
  .curmodel:hover{border-color:rgba(0,255,157,.3);}
  .curmodel-name{color:#00ff9d;font-family:'Orbitron',monospace;font-size:10px;}
  .curmodel-nokey{color:rgba(255,160,0,.7);font-size:9px;}

  /* Status */
  .statusbar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(0,255,157,.03);border:1px solid rgba(0,255,157,.12);margin-bottom:20px;font-size:11px;color:rgba(0,255,157,.55);letter-spacing:2px;min-height:40px;}
  .dot{width:6px;height:6px;border-radius:50%;background:#00ff9d;flex-shrink:0;}
  .dot.blink{animation:blink 1s step-end infinite;}
  @keyframes blink{50%{opacity:0;}}

  /* Upload */
  .dropzone{border:1px dashed rgba(0,255,157,.3);background:rgba(0,255,157,.02);padding:50px 20px;text-align:center;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;margin-bottom:20px;}
  .dropzone::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00ff9d,transparent);animation:scan 3s linear infinite;}
  @keyframes scan{0%{transform:translateY(0);opacity:1;}100%{transform:translateY(400px);opacity:0;}}
  .dropzone:hover,.dropzone.over{border-color:rgba(0,255,157,.6);background:rgba(0,255,157,.05);}
  .plane-icon{font-size:46px;margin-bottom:14px;opacity:.7;}
  .dropzone h2{font-family:'Orbitron',monospace;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px;}
  .dropzone p{font-size:10px;color:rgba(0,255,157,.4);letter-spacing:2px;}

  /* Image */
  .imgwrap{position:relative;margin-bottom:18px;border:1px solid rgba(0,255,157,.2);overflow:hidden;background:#000;cursor:pointer;}
  .imgwrap::before,.imgwrap::after{content:'';position:absolute;width:18px;height:18px;border-color:#00ff9d;border-style:solid;z-index:3;}
  .imgwrap::before{top:0;left:0;border-width:2px 0 0 2px;}
  .imgwrap::after{bottom:0;right:0;border-width:0 2px 2px 0;}
  .imgwrap img{width:100%;max-height:400px;object-fit:contain;display:block;}
  .imglbl{position:absolute;top:10px;right:10px;background:rgba(0,255,157,.1);border:1px solid rgba(0,255,157,.3);padding:3px 9px;font-size:9px;letter-spacing:2px;color:rgba(0,255,157,.7);z-index:4;}
  .sizetag{position:absolute;bottom:10px;left:10px;background:rgba(0,0,0,.6);border:1px solid rgba(0,255,157,.2);padding:3px 8px;font-size:9px;color:rgba(0,255,157,.5);z-index:4;}
  .img-hint{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);opacity:0;transition:all .25s;z-index:2;}
  .imgwrap:hover .img-hint{background:rgba(0,0,0,.52);opacity:1;}
  .img-hint span{font-family:'Orbitron',monospace;font-size:11px;letter-spacing:3px;color:#00ff9d;text-shadow:0 0 12px rgba(0,255,157,.7);text-transform:uppercase;}

  /* Buttons */
  .btn{width:100%;padding:15px;background:transparent;border:1px solid #00ff9d;color:#00ff9d;font-family:'Orbitron',monospace;font-size:11px;font-weight:600;letter-spacing:4px;text-transform:uppercase;cursor:pointer;transition:all .3s;position:relative;overflow:hidden;margin-bottom:20px;}
  .btn::before{content:'';position:absolute;inset:0;background:#00ff9d;transform:scaleX(0);transform-origin:left;transition:transform .3s;z-index:-1;}
  .btn:hover::before{transform:scaleX(1);}
  .btn:hover{color:#050a0f;}
  .btn:disabled{border-color:rgba(0,255,157,.2);color:rgba(0,255,157,.3);cursor:not-allowed;}
  .btn:disabled::before{display:none;}
  .btn.pulse{animation:pb 1.2s ease-in-out infinite;}
  @keyframes pb{0%,100%{box-shadow:0 0 5px rgba(0,255,157,.2);}50%{box-shadow:0 0 25px rgba(0,255,157,.6);}}

  /* Results */
  .results{border:1px solid rgba(0,255,157,.22);background:rgba(0,10,5,.6);animation:fadein .5s ease;}
  @keyframes fadein{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .rhdr{background:rgba(0,255,157,.05);border-bottom:1px solid rgba(0,255,157,.12);padding:11px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;}
  .rtitle{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;text-transform:uppercase;}
  .rmodel{font-size:9px;color:rgba(0,255,157,.4);}
  .rtime{font-size:10px;color:rgba(0,255,157,.35);}
  .dgrid{display:grid;grid-template-columns:1fr 1fr;}
  @media(max-width:480px){.dgrid{grid-template-columns:1fr;}}
  .dcell{padding:18px;border-right:1px solid rgba(0,255,157,.07);border-bottom:1px solid rgba(0,255,157,.07);}
  .dcell:nth-child(even){border-right:none;}
  .dlabel{font-size:8px;letter-spacing:3px;color:rgba(0,255,157,.4);text-transform:uppercase;margin-bottom:5px;}
  .dval{font-family:'Orbitron',monospace;font-size:15px;font-weight:600;color:#00ff9d;text-shadow:0 0 8px rgba(0,255,157,.3);word-break:break-word;}
  .dval.lg{font-size:20px;}
  .dval.dim{color:rgba(0,255,157,.3);font-size:12px;font-family:'Share Tech Mono',monospace;}
  .cbar{height:2px;background:rgba(0,255,157,.12);margin-top:7px;overflow:hidden;}
  .cfill{height:100%;background:linear-gradient(90deg,#00ff9d,#00ccff);box-shadow:0 0 6px rgba(0,255,157,.5);transition:width 1s ease;}
  .notes{padding:18px;border-top:1px solid rgba(0,255,157,.07);}
  .nlabel{font-size:8px;letter-spacing:3px;color:rgba(0,255,157,.4);text-transform:uppercase;margin-bottom:8px;}
  .ntext{font-size:12px;line-height:1.8;color:rgba(0,255,157,.65);}
  .noplane{padding:36px;text-align:center;color:rgba(255,80,80,.65);}
  .noplane .i{font-size:38px;margin-bottom:10px;}
  .noplane p{font-size:11px;letter-spacing:2px;text-transform:uppercase;}
  .errmsg{padding:20px;color:rgba(255,100,100,.8);font-size:11px;background:rgba(255,0,0,.03);}
  .resetbtn{width:100%;margin-top:18px;padding:10px;border:1px solid rgba(0,255,157,.2);background:transparent;color:rgba(0,255,157,.45);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .3s;}
  .resetbtn:hover{border-color:rgba(0,255,157,.5);color:#00ff9d;background:rgba(0,255,157,.04);}
  .privacy-note{font-size:9px;color:rgba(0,255,157,.25);letter-spacing:1px;text-align:center;padding:12px 0 0;}
  input[type=file]{display:none;}

  /* History panel */
  .hist-panel{border:1px solid rgba(0,255,157,.15);background:rgba(0,10,5,.6);margin-top:20px;animation:fadein .4s ease;}
  .hist-hdr{background:rgba(0,255,157,.04);border-bottom:1px solid rgba(0,255,157,.1);padding:10px 18px;display:flex;align-items:center;gap:10px;}
  .hist-toggle{flex:1;background:transparent;border:none;color:rgba(0,255,157,.6);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;gap:8px;text-align:left;text-transform:uppercase;padding:0;transition:color .2s;}
  .hist-toggle:hover{color:#00ff9d;}
  .hist-title{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;}
  .hist-count{font-size:9px;color:rgba(0,255,157,.35);border:1px solid rgba(0,255,157,.15);padding:1px 6px;}
  .hist-arrow{font-size:9px;opacity:.5;margin-left:4px;}
  .hist-clear{background:transparent;border:1px solid rgba(255,80,80,.25);color:rgba(255,80,80,.45);font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;cursor:pointer;padding:4px 10px;transition:all .2s;white-space:nowrap;flex-shrink:0;}
  .hist-clear:hover{border-color:rgba(255,80,80,.7);color:rgba(255,80,80,.9);}
  .hist-list{max-height:340px;overflow-y:auto;}
  .hist-list::-webkit-scrollbar{width:3px;}
  .hist-list::-webkit-scrollbar-track{background:transparent;}
  .hist-list::-webkit-scrollbar-thumb{background:rgba(0,255,157,.2);}
  .hist-item{display:flex;align-items:center;gap:14px;padding:11px 18px;border-bottom:1px solid rgba(0,255,157,.05);transition:background .2s;}
  .hist-item:last-child{border-bottom:none;}
  .hist-item-click{cursor:pointer;}
  .hist-item-click:hover{background:rgba(0,255,157,.05);border-left:2px solid rgba(0,255,157,.35);}
  .hist-item-click:hover .hist-reg{color:#fff;}
  .hist-thumb{width:60px;height:44px;object-fit:cover;border:1px solid rgba(0,255,157,.15);flex-shrink:0;background:#000;}
  .hist-thumb-ph{width:60px;height:44px;border:1px solid rgba(0,255,157,.1);flex-shrink:0;background:rgba(0,255,157,.02);display:flex;align-items:center;justify-content:center;font-size:20px;opacity:.25;}
  .hist-info{flex:1;min-width:0;}
  .hist-reg{font-family:'Orbitron',monospace;font-size:13px;font-weight:600;color:#00ff9d;margin-bottom:3px;}
  .hist-detail{font-size:10px;color:rgba(0,255,157,.5);letter-spacing:.5px;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .hist-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
  .hist-ts{font-size:9px;color:rgba(0,255,157,.28);letter-spacing:.5px;}
  .hist-mdl{font-size:8px;color:rgba(0,255,157,.2);border:1px solid rgba(0,255,157,.1);padding:1px 5px;letter-spacing:1px;}
  .hist-del{background:transparent;border:none;color:rgba(255,80,80,.25);font-size:15px;cursor:pointer;padding:5px 7px;transition:color .2s;flex-shrink:0;line-height:1;}
  .hist-del:hover{color:rgba(255,80,80,.85);}
  .hist-src{font-size:8px;padding:1px 5px;letter-spacing:1px;border:1px solid;flex-shrink:0;}
  .hist-src-puter{color:#a78bfa;border-color:rgba(167,139,250,.3);background:rgba(167,139,250,.07);}
  .hist-src-api{color:rgba(255,170,0,.75);border-color:rgba(255,170,0,.25);background:rgba(255,170,0,.05);}

  /* Cache panel */
  .cache-info{display:flex;flex-direction:column;gap:14px;}
  .cache-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(0,255,157,.07);}
  .cache-row:last-child{border-bottom:none;}
  .cache-label{font-size:10px;color:rgba(0,255,157,.5);letter-spacing:2px;text-transform:uppercase;}
  .cache-val{font-family:'Orbitron',monospace;font-size:13px;color:#00ff9d;}
  .cache-clear{background:transparent;border:1px solid rgba(255,80,80,.35);color:rgba(255,80,80,.6);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;padding:7px 16px;transition:all .2s;width:100%;margin-top:4px;}
  .cache-clear:hover{border-color:rgba(255,80,80,.8);color:rgba(255,80,80,1);background:rgba(255,40,40,.05);}

  /* Scan overlay */
  .scan-overlay{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;}
  .scan-bg{position:absolute;inset:0;background:rgba(0,8,4,.32);}
  .scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 0%,rgba(0,255,157,.25) 15%,#00ff9d 50%,rgba(0,255,157,.25) 85%,transparent 100%);box-shadow:0 0 10px rgba(0,255,157,.9),0 0 24px rgba(0,255,157,.4),0 0 40px rgba(0,255,157,.15);animation:scanMove 1.8s linear infinite;}
  @keyframes scanMove{0%{top:-2px;}100%{top:100%;}}
  .scan-hgrid div{position:absolute;left:0;right:0;height:1px;background:rgba(0,255,157,.055);}
  .scan-corner{position:absolute;width:30px;height:30px;border:2px solid #00ff9d;box-shadow:0 0 8px rgba(0,255,157,.7);animation:cPulse .9s ease-in-out infinite alternate;}
  .scan-tl{top:10px;left:10px;border-right:none;border-bottom:none;}
  .scan-tr{top:10px;right:10px;border-left:none;border-bottom:none;}
  .scan-bl{bottom:10px;left:10px;border-right:none;border-top:none;}
  .scan-br{bottom:10px;right:10px;border-left:none;border-top:none;}
  @keyframes cPulse{from{opacity:.55;box-shadow:0 0 5px rgba(0,255,157,.5);}to{opacity:1;box-shadow:0 0 14px rgba(0,255,157,1);}}
  .scan-cross{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);}
  .scan-cross::before,.scan-cross::after{content:'';position:absolute;background:rgba(0,255,157,.45);}
  .scan-cross::before{width:26px;height:1px;top:0;left:-13px;}
  .scan-cross::after{width:1px;height:26px;top:-13px;left:0;}
  .scan-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:52px;height:52px;border:1px solid rgba(0,255,157,.25);border-radius:50%;animation:ringPulse 1.2s ease-in-out infinite;}
  @keyframes ringPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.3;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:.7;}}
  .scan-top-txt{position:absolute;top:14px;left:50%;transform:translateX(-50%);font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:3px;color:rgba(0,255,157,.55);white-space:nowrap;text-transform:uppercase;}
  .scan-bot-txt{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;color:#00ff9d;text-shadow:0 0 10px rgba(0,255,157,.9);animation:blinkText .7s step-end infinite;white-space:nowrap;}
  @keyframes blinkText{50%{opacity:.2;}}
  .scan-data{position:absolute;top:50%;left:12px;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px;}
  .scan-data span{font-family:'Share Tech Mono',monospace;font-size:7px;color:rgba(0,255,157,.38);letter-spacing:.5px;}

  /* Lock overlay */
  .lock-overlay{position:absolute;inset:0;z-index:7;pointer-events:none;display:flex;align-items:center;justify-content:center;animation:lockFadeOut 2.2s ease forwards;}
  @keyframes lockFadeOut{0%{opacity:0;}12%{opacity:1;}75%{opacity:1;}100%{opacity:0;}}
  .lock-frame{position:relative;width:130px;height:88px;border:1px solid rgba(0,255,157,.7);box-shadow:0 0 22px rgba(0,255,157,.45),inset 0 0 18px rgba(0,255,157,.08);animation:lockZoom .45s cubic-bezier(.16,1,.3,1) forwards;}
  @keyframes lockZoom{from{transform:scale(2.2);opacity:0;}to{transform:scale(1);opacity:1;}}
  .lock-frame::before,.lock-frame::after{content:'';position:absolute;width:18px;height:18px;border-color:#00ff9d;border-style:solid;box-shadow:0 0 8px rgba(0,255,157,.8);}
  .lock-frame::before{top:-2px;left:-2px;border-width:2px 0 0 2px;}
  .lock-frame::after{bottom:-2px;right:-2px;border-width:0 2px 2px 0;}
  .lock-label{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);font-family:'Orbitron',monospace;font-size:9px;letter-spacing:5px;color:#00ff9d;text-shadow:0 0 12px rgba(0,255,157,.9);white-space:nowrap;animation:lockZoom .45s cubic-bezier(.16,1,.3,1) forwards;}

  /* Failure overlay */
  .fail-overlay{position:absolute;inset:0;z-index:6;pointer-events:none;animation:failFadeOut 2.5s ease forwards;}
  @keyframes failFadeOut{0%{opacity:0;}12%{opacity:1;}72%{opacity:1;}100%{opacity:0;}}
  .fail-bg{position:absolute;inset:0;background:rgba(220,40,40,.18);animation:failFlicker .22s step-end 5;}
  @keyframes failFlicker{50%{background:rgba(220,40,40,.42);}}
  .fail-x{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;animation:failZoom .4s cubic-bezier(.16,1,.3,1) forwards;}
  @keyframes failZoom{from{transform:translate(-50%,-50%) scale(2.8);opacity:0;}to{transform:translate(-50%,-50%) scale(1);opacity:1;}}
  .fail-x::before,.fail-x::after{content:'';position:absolute;width:100%;height:2px;top:50%;left:0;background:#ff4444;box-shadow:0 0 12px rgba(255,60,60,1),0 0 24px rgba(255,60,60,.5);}
  .fail-x::before{transform:translateY(-50%) rotate(45deg);}
  .fail-x::after{transform:translateY(-50%) rotate(-45deg);}
  .fail-corner-tl,.fail-corner-tr,.fail-corner-bl,.fail-corner-br{position:absolute;width:26px;height:26px;border:2px solid #ff4444;box-shadow:0 0 8px rgba(255,60,60,.8);}
  .fail-corner-tl{top:10px;left:10px;border-right:none;border-bottom:none;}
  .fail-corner-tr{top:10px;right:10px;border-left:none;border-bottom:none;}
  .fail-corner-bl{bottom:10px;left:10px;border-right:none;border-top:none;}
  .fail-corner-br{bottom:10px;right:10px;border-left:none;border-top:none;}
  .fail-text{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-family:'Orbitron',monospace;font-size:9px;letter-spacing:4px;color:#ff4444;text-shadow:0 0 12px rgba(255,60,60,.9);white-space:nowrap;animation:failZoom .4s cubic-bezier(.16,1,.3,1) .15s both;}

  /* Registration lock-in animation */
  @keyframes regLock{
    0%  {transform:scale(3.5);opacity:0;filter:blur(8px);color:#fff;text-shadow:0 0 30px rgba(0,255,157,1);}
    45% {transform:scale(.92);opacity:1;filter:blur(0);color:#fff;text-shadow:0 0 20px rgba(0,255,157,.9);}
    65% {transform:scale(1.06);}
    85% {transform:scale(.98);color:#00ff9d;text-shadow:0 0 12px rgba(0,255,157,.6);}
    100%{transform:scale(1);color:#00ff9d;text-shadow:0 0 8px rgba(0,255,157,.3);}
  }
  .reg-lock{animation:regLock .8s cubic-bezier(.16,1,.3,1) .3s both;}

  /* Flight lookup */
  .fl-loading{display:flex;align-items:center;gap:7px;font-size:10px;color:rgba(0,255,157,.45);letter-spacing:1px;margin-top:2px;}
  .fl-spin{display:inline-block;animation:flspin .7s linear infinite;font-size:13px;}
  @keyframes flspin{to{transform:rotate(360deg);}}
  .fl-val-wrap{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;}
  .fl-source{font-size:8px;color:rgba(0,255,157,.35);letter-spacing:1px;border:1px solid rgba(0,255,157,.15);padding:1px 5px;flex-shrink:0;}

  /* Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadein .15s ease;}
  .modal{background:#050a0f;border:1px solid rgba(167,139,250,.4);max-width:400px;width:90%;box-shadow:0 0 50px rgba(167,139,250,.15);}
  .modal-hdr{background:rgba(167,139,250,.07);border-bottom:1px solid rgba(167,139,250,.15);padding:13px 18px;display:flex;align-items:center;gap:8px;}
  .modal-hdr-icon{font-size:14px;opacity:.8;}
  .modal-hdr-title{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(167,139,250,.9);}
  .modal-body{padding:20px 20px 16px;font-size:11px;line-height:1.9;color:rgba(0,255,157,.65);}
  .modal-body b{color:rgba(167,139,250,.9);font-weight:normal;}
  .modal-check-row{display:flex;align-items:center;gap:9px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(0,255,157,.07);cursor:pointer;font-size:10px;color:rgba(0,255,157,.45);user-select:none;}
  .modal-check-row input[type=checkbox]{accent-color:#a78bfa;width:13px;height:13px;cursor:pointer;flex-shrink:0;}
  .modal-footer{display:flex;gap:10px;padding:0 20px 20px;}
  .modal-btn-ok{flex:1;padding:11px;background:transparent;border:1px solid #a78bfa;color:#a78bfa;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:3px;cursor:pointer;transition:all .2s;text-transform:uppercase;}
  .modal-btn-ok:hover{background:#a78bfa;color:#050a0f;}
  .modal-btn-cancel{padding:11px 16px;background:transparent;border:1px solid rgba(0,255,157,.15);color:rgba(0,255,157,.35);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;transition:all .2s;}
  .modal-btn-cancel:hover{border-color:rgba(0,255,157,.4);color:rgba(0,255,157,.65);}

  /* EXIF / Camera Info */
  .exif-card{border:1px solid rgba(0,255,157,.15);background:rgba(0,10,5,.6);margin-top:14px;animation:fadein .4s ease;}
  .exif-toggle{width:100%;padding:11px 18px;background:transparent;border:none;color:rgba(0,255,157,.55);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:color .2s;text-transform:uppercase;}
  .exif-toggle:hover{color:#00ff9d;background:rgba(0,255,157,.03);}
  .exif-toggle .etitle{display:flex;align-items:center;gap:8px;}
  .exif-toggle .earrow{font-size:10px;opacity:.5;}
  .exif-body{border-top:1px solid rgba(0,255,157,.08);padding:14px 18px;}
  .exif-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;}
  @media(max-width:480px){.exif-grid{grid-template-columns:1fr;}}
  .exif-row{display:flex;flex-direction:column;padding:8px 12px 8px 0;border-bottom:1px solid rgba(0,255,157,.04);}
  .exif-row:nth-child(even){padding-left:12px;border-left:1px solid rgba(0,255,157,.04);}
  .exif-lbl{font-size:8px;letter-spacing:2px;color:rgba(0,255,157,.35);text-transform:uppercase;margin-bottom:3px;}
  .exif-val{font-family:'Orbitron',monospace;font-size:11px;color:rgba(0,255,157,.75);word-break:break-all;}
  .exif-badge{display:inline-flex;align-items:center;gap:5px;font-size:8px;letter-spacing:1px;color:rgba(0,255,157,.45);border:1px solid rgba(0,255,157,.15);padding:2px 7px;margin-left:6px;}
`;
