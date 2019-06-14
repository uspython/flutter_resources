/// Generate by img.js file
import 'package:flutter/painting.dart' show AssetImage;

class Images {
  static final Images _images = Images._internal();
  factory Images() {
    return _images;
  }
  Images._internal();
  static const _n = 'resources';
  static const _p = 'lib/assets/images';

  final fetch = (String name) => AssetImage('$_p/$name', package: _n);
  AssetImage get testImage => fetch('test_image.png');
  AssetImage get testImage2 => fetch('test_image2.png');
  // your code here...
}
