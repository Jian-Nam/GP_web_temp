// 불러오기
import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/RGBELoader.js';
import { DoubleSide } from 'three';


// D-DAY Count
const todayDay = new Date();
const gradDay = new Date("2022-12-06");
console.log(gradDay);	
const diff = gradDay - todayDay;		
const diffDay = Math.floor(diff / (1000*60*60*24));

function main(){
    //장면 만들기
    const canvas = document.querySelector("#c");

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.001, 100 );
    scene.position.set(0, 0, 5.5);
    camera.position.set(0, 0, 5.5);
   

    //배경
    var colors = ['#fff134', '#00c5b5', '#4891dc'];
	var ranColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(ranColor);
    scene.background = new THREE.Color(ranColor);

    //텍스쳐
    const textureLoader = new THREE.TextureLoader();

    //이미지
    let imgTexture = new THREE.TextureLoader().load("img/poster_white.png");
    let imgGeometry = new THREE.PlaneGeometry(1.1, 1.6);
    let imgMaterial = new THREE.MeshBasicMaterial({ 
        map: imgTexture,
        side: THREE.DoubleSide,
        color: ranColor
    });
    let imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
    imgMesh.position.set(0, 0, 0);
    scene.add(imgMesh);

    imgMesh.rotation.y = - 0.5;
    imgMesh.rotation.z = - 0.3;

    //이미지 바꾸기
    $("#changeImg").on("change", function(e){
        e.preventDefault();
        erase();
        let userImage = e.target.files[0];     
        let userImageURL = URL.createObjectURL( userImage );
    
        let loader = new THREE.TextureLoader();
        loader.setCrossOrigin("");
        let imgTexture = loader.load(userImageURL);

        let imgGeometry = new THREE.PlaneGeometry(1.1, 1.6);
        let imgMaterial = new THREE.MeshBasicMaterial({ 
            map: imgTexture,
            side: THREE.DoubleSide,
        });
        let imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
        imgMesh.position.set(0, 0, 0);
        scene.add(imgMesh);

        imgMesh.rotation.y = - 0.5;
        imgMesh.rotation.z = - 0.3;
    })
    function erase() {
        scene.remove(imgMesh);
    }

    //큐브 
    const geometry = new RoundedBoxGeometry( 1.9, 1.9, 1.9, 16, 0.1 );

    // 빛
    const hdrEquirect = new RGBELoader().load(
        "empty_warehouse_01_2k.hdr",
        () => {
        hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
        }
    );

    // 큐브 텍스처
    const normalMapTexture = textureLoader.load("img/ice_normal.jpg");
    normalMapTexture.wrapS = THREE.RepeatWrapping;
    normalMapTexture.wrapT = THREE.RepeatWrapping;
    normalMapTexture.repeat.set(1.5, 1.5);

    const material = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 2,
        roughness: 0.015,
        envMap: hdrEquirect,
        envMapIntensity: 1.5,
        normalMap: normalMapTexture,
        normalScale: new THREE.Vector2( 0.2, 0.2 ),
        clearcoat: 0.2,
        clearcoatRoughness: 1,
        clearcoatNormalMap: normalMapTexture
    });

    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
    
    // 로고 박스
    const logoTexture = textureLoader.load("img/square_white.png");
    logoTexture.wrapS = THREE.RepeatWrapping;
    logoTexture.wrapT = THREE.RepeatWrapping;
    logoTexture.repeat.set(1,1);
    const logoGeometry = new THREE.BoxGeometry(15, 15, 15);
    const logoMaterial = new THREE.MeshPhysicalMaterial({
        normalMap:logoTexture,
        side: THREE.DoubleSide,
        transmission: 0.9,
        thickness: 1,
        roughness: 0,
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.rotation.x = -0.25;
    logo.rotation.y = -0.75;
    scene.add(logo);
    logo.position.set = (0,0,-10);

    

    //로고타입
    const logoATexture = textureLoader.load("img/logo_A.png");
    const logoBTexture = textureLoader.load("img/logo_B.png");
    const logoAGeometry = new THREE.PlaneGeometry(2.31, 0.5);
    const logoAMaterial = new THREE.MeshPhysicalMaterial({
        normalMap:logoATexture,
        side: DoubleSide,
        transmission: 1,
        thickness: 0,
        roughness: 0,
    })
    const logoBGeometry = new THREE.PlaneGeometry(1.55, 0.5);
    const logoBMaterial = new THREE.MeshPhysicalMaterial({
        normalMap:logoBTexture,
        side: DoubleSide,
        transmission: 1,
        thickness: 0,
        roughness: 0,
    })
    const logoA = new THREE.Mesh(logoAGeometry, logoAMaterial);
    const logoB = new THREE.Mesh(logoBGeometry, logoBMaterial);
    logoB.position.set(2.2, 0.5, 0);
    logoB.rotation.x = 0.3;
    logoB.rotation.y = 0.8;
    logoB.rotation.z = 0.3;
    const logotype = new THREE.Group();
    logotype.add(logoA, logoB);
    logotype.position.set(-1.5, 1.5, -1);


    //D-day
    let loader = new THREE.FontLoader();
    let font_src = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json';
    loader.load(font_src, font => {
        let text_geometry = new THREE.TextGeometry( `D - ${diffDay}`, {
            font, 
            size: 0.5, 
            height: 0, // How deep are the letters
            bevelEnabled: true,
            bevelThickness: 0.001, // How deep into text bevel goes
            bevelSize: 0.01, // How far from text outline is bevel
        });
        text_geometry.center();

        let text_material = new THREE.MeshBasicMaterial({ 
            color: ranColor,
            transparent: true,
            opacity: 1,
        })
    
        let ranX = THREE.MathUtils.randFloat(-0.5, 1.2);
        let ranY = THREE.MathUtils.randFloat(-0.5, 1);
        let ranZ = THREE.MathUtils.randFloat(-0.3, 0.3);

        let dday = new THREE.Mesh(text_geometry, text_material); // triangular polygon mesh
        dday.position.set(1.5, -1.5, 1); 
        dday.rotation.x = -0;
        dday.rotation.y = -1;
        dday.rotation.Z = -0;

        const lt4Rotate = new THREE.Group();
        lt4Rotate.add(logotype, dday);
        scene.add(lt4Rotate);
        console.log('x: ' + ranX);
        console.log('y: ' + ranY);
        console.log('z: ' + ranZ);
        lt4Rotate.rotation.x = ranX;
        lt4Rotate.rotation.y = ranY;
        lt4Rotate.rotation.z = ranZ;

        
    })
    
               
    




    //렌더
    // 카메라와 마우스 상호작용을 위해 OrbitControls를 설정합니다.
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.6; // 마우스로 카메라를 회전시킬 속도입니다. 기본값(Float)은 1입니다.
    controls.zoomSpeed = 0.3; // 마우스 휠로 카메라를 줌 시키는 속도 입니다. 기본값(Float)은 1입니다.
    controls.panSpeed = 0.6; // 패닝 속도 입니다. 기본값(Float)은 1입니다.
    controls.minDistance = 5; // 마우스 휠로 카메라 거리 조작시 최소 값. 기본값(Float)은 0 입니다.
    controls.maxDistance = 7; // 마우스 휠로 카메라 거리 조작시 최대 값. 기본값(Float)은 무제한 입니다.
    controls.enablePan = true;


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      const state = {
        time: 0,
      };
    
      function render() {
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        // intro
        gsap.to(scene.position, {
            z: 0, 
            duration: 2, 
            ease: 'power1.easeInOut',
        })
        gsap.to(logo.position, {
            z: 1, 
            duration: 2, 
            ease: 'power1.easeInOut',
        })

        // 기본 회전
        const speed = 0.002;
        cube.rotation.x += speed;
        cube.rotation.y += speed;
        imgMesh.rotation.x += speed;
        imgMesh.rotation.y += speed;
    
        renderer.render(scene, camera);
      }
      

      function animate(time) {
        state.time = time * 0.001;
        render();
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);

      //resize
      function crop() {
        renderer.setSize(1500,1500);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      function back() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }


        const elem = document.querySelector('#screenshot');
        elem.addEventListener('click', () => {
            crop();
            render();
            canvas.toBlob((blob) => {
            saveBlob(blob, `frozencube.png`); //screencapture-${canvas.width}x${canvas.height}.png
            });
            back();
        });

        const saveBlob = (function() {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            return function saveData(blob, fileName) {
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            //window.open(url);
            a.download = fileName;
            a.click();
            a.remove();
            };
        }());

        

}
main();

