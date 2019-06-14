/*
 * CityHome App
 * @Author: jeffzhao
 * @Date: 2019-03-15 17:22:32
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-03-15 17:29:18
 * Copyright  © 2019  . All rights reserved.
 */

const fs = require('fs');

function camelize(text) {
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
  });
}

const imageFileNames = () => {
  const array = fs
    .readdirSync('lib/src/resources/lib/assets/images/2.0x')
    .filter(file => file.endsWith('.png'))
    .map(file => file.replace('@2x.png', '').replace('@3x.png', '').replace('.png', ''));
  return Array.from(new Set(array));
};

const generate = () => {
  const names = imageFileNames();
  const properties = names
    .map(fileName => ({ camelName: camelize(fileName), fileName }))
    .map(o => `AssetImage get ${o.camelName} => fetch('${o.fileName}.png')`)
    .join(';\n  ');

  const string = `/// Generate by img.js file
import 'package:flutter/painting.dart' show AssetImage;

class Images {
  static final Images _images = Images._internal();
  factory Images() { return _images; }
  Images._internal();
  static const _n = 'resources';
  static const _p = 'lib/assets/images';

  final fetch = (String name) => AssetImage('$_p/$name', package: _n);
  ${properties};
  // your code here...
}

`;

  fs.writeFileSync('lib/src/resources/lib/src/images.dart', string, 'utf8');
  console.log(`${names.length} properties Done!`);
};

const copyToAssets = () => {
  const fileNameArray = fs
    .readdirSync('imagepool')
    .filter(file => file.endsWith('.png'));

  Array.from(new Set(fileNameArray))
  .forEach((item) => {
    // Copy to resource assets images folder
    let fileName = item.replace('@2x.png', '').replace('@3x.png', '').replace('.png', '')
    if (item.includes('@2x')) {
      console.log(`Copying ${item} to lib/src/resources/lib/assets/images/2.0x/${fileName}.png`);
      fs.copyFileSync(`imagepool/${item}`, `lib/src/resources/lib/assets/images/2.0x/${fileName}.png`);
    } else if (item.includes('@3x')) {
      console.log(`Copying ${item} to lib/src/resources/lib/assets/images/3.0x/${fileName}.png`);
      fs.copyFileSync(`imagepool/${item}`, `lib/src/resources/lib/assets/images/3.0x/${fileName}.png`);
    } else {
      console.log(`Copying ${item} to lib/src/resources/lib/assets/images/${fileName}.png`);
      fs.copyFileSync(`imagepool/${item}`, `lib/src/resources/lib/assets/images/${fileName}.png`);
    }
  });
}

const makeDirIfNeeded = () => {
  if(!fs.existsSync('lib/src/resources/lib/assets/images/2.0x/')) {
    console.log('lib/src/resources/lib/assets/images/2.0x/ not exist, create one.');
    fs.mkdirSync('lib/src/resources/lib/assets/images/2.0x/');
  }
  if(!fs.existsSync('lib/src/resources/lib/assets/images/3.0x/')) {
    console.log('lib/src/resources/lib/assets/images/3.0x/ not exist, create one.');
    fs.mkdirSync('lib/src/resources/lib/assets/images/3.0x/');
  }
};

try {
  makeDirIfNeeded();
  copyToAssets();
  generate();
} catch (error) {
  console.log(error)
} finally {
  const array = fs
    .readdirSync('imagepool')
    .filter(file => file.endsWith('.png'))
    .forEach((fileName) => fs.unlinkSync(`imagepool/${fileName}`))
  console.log('image pool drain!');
}

