let fs = require('fs');

function replace_string_in_file(filename, to_replace, replace_with) {
  let data = fs.readFileSync(filename, 'utf8');

  let result = data.replace(to_replace, replace_with);
  fs.writeFileSync(filename, result, 'utf8');
}

let filestoreplace = ["src/main.ts"];

filestoreplace.forEach(function(val) {
  if (fs.existsSync(val)) {
    replace_string_in_file(val, '/* cordova-version-config-off', '// cordova-version-config-on');
    replace_string_in_file(val, 'cordova-version-config-off */', '// end-cordova-version-config-on');
  } else {
    console.log("missing: " + val);
  }
});
