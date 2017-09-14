{
  "targets": [
    {
      "target_name": "rf24js",
      "sources": [ 
        "rf24js.cc"
        ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
        ],
      "link_settings": {
        "libraries": [
          "-lrf24"
        ]
      }   
    }
  ]
}
