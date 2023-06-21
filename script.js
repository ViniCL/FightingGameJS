require.setModuleRoot('./');
require.run('main')

function playAudio() {
    var audio = document.getElementById("audio")
    audio.play()

    var playButton = document.getElementById("play-button")
    playButton.style.display = "none"
}