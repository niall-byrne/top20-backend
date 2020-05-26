#!/bin/bash

gcloud functions deploy top-20-backend --entry-point lastfm --runtime nodejs10 --trigger-http --env-vars-file=.env.yaml
