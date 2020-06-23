#!/bin/bash

build() {
    echo 'building react'

    rm -rf dist/* build/*

    export REACT_APP_ENV=production
    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    react-scripts build

    mkdir -p dist
    cp -r build/* dist
}

build