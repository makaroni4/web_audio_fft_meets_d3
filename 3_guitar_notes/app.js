$(function() {
  function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
  }

  if(getChromeVersion() > 57) {
    var processor = new AudioProcessor();

    processor.attached();
  } else if(getChromeVersion() < 58) {
    alert("Update Chrome to latest version");
  }
});
