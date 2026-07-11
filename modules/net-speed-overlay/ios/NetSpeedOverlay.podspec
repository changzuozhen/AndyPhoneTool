Pod::Spec.new do |s|
  s.name           = 'NetSpeedOverlay'
  s.version        = '1.0.0'
  s.summary        = 'Floating network speed overlay'
  s.description    = 'Android overlay and iOS PiP network speed monitor for AndyPhoneTool'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.frameworks = 'AVFoundation', 'AVKit', 'CoreMedia', 'CoreVideo', 'UIKit'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
