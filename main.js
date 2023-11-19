const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const header_song = $(".header-name-song");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const btn_toggle_play = $(".btn-toggle-play");
const btn_next = $(".btn-next");
const btn_prev = $(".btn-prev");
const btn_play = $(".btn-play");
const btn_pause = $(".btn-pause ");
const btn_repeat = $(".btn-repeat");
const btn_random = $(".btn-random");
const progress = $("#progress");

const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
    duration: 100000,
    iterations: Infinity,
});

cdThumbAnimate.pause();
fetch("https://my-json-server.typicode.com/phuocnguyn/Music-Media-Player/songs")
    .then(function (response) {
        return response.json();
    })

    .then(function (songsArray) {
        const songList = songsArray.map(function (song) {
            return `
            <div id="song-${song.id}" class="song">
                <div
                    class="thumb"
                    style="
                        background-image: url('${song.image}');
                    "
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        $(".playlist").innerHTML = songList.join("");
        return songsArray;
    })
    .then(function (songsArray) {
        header_song.innerHTML = songsArray[0].name;
        cdThumb.style.backgroundImage = `url(${songsArray[0].image})`;
        audio.src = "./audio/" + songsArray[0].path;
        return songsArray;
    })

    .then(function (songsArray) {
        let currentIndexSong = songsArray.findIndex(function (song) {
            return song.name === header_song.innerText;
        });

        function playSong(index) {
            header_song.innerHTML = songsArray[index].name;
            cdThumb.style.backgroundImage = `url(${songsArray[index].image})`;
            audio.src = "./audio/" + songsArray[index].path;
            audio.play();
        }

        audio.ontimeupdate = function () {
            progress.value = Math.floor(
                (audio.currentTime / audio.duration) * 100
            );
        };

        btn_toggle_play.addEventListener("click", function () {
            if (audio.paused) {
                audio.play();
                $(".icon-play").style.display = "none";
                $(".icon-pause").style.display = "inline-block";
                cdThumbAnimate.play();
            } else {
                audio.pause();
                $(".icon-pause").style.display = "none";
                $(".icon-play").style.display = "inline-block";
                cdThumbAnimate.pause();
            }
        });

        progress.onchaged = function () {
            audio.currentTime = (progress.value / 100) * audio.duration;
        };

        btn_repeat.addEventListener("click", function () {
            audio.load();
            audio.play();
        });

        btn_prev.addEventListener("click", function () {
            if (currentIndexSong == 0) playSong(currentIndexSong);
            else playSong(--currentIndexSong);
        });
        btn_random.addEventListener("click", function () {
            const indexSongPlaying = currentIndexSong;
            do {
                currentIndexSong = Math.floor(
                    Math.random() * songsArray.length
                );
            } while (currentIndexSong == indexSongPlaying);
            playSong(currentIndexSong);
        });
        btn_next.addEventListener("click", function () {
            if (currentIndexSong == songsArray.length - 1) {
                currentIndexSong = 0;
                playSong(0);
            } else playSong(++currentIndexSong);
        });

        songsArray.forEach(function (song) {
            $(`#song-${song.id}`).onclick = function () {
                playSong(
                    songsArray.findIndex(function (e) {
                        return e.name === song.name;
                    })
                );
            };
        });

        audio.onended = function () {
            btn_next.click();
        }

    });
