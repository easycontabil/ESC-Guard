#!/bin/sh

FOLDER_NAME=$1

echo Generating CRUD to ${FOLDER_NAME}

yo secjs ${FOLDER_NAME} --path=./${FOLDER_NAME}

echo Moving E2E Tests
mv ./${FOLDER_NAME}/E2E/${FOLDER_NAME} ./test/E2E

echo Moving Dto
mv ./${FOLDER_NAME}/Dtos/${FOLDER_NAME}Dto.ts ./app/Contracts/Dtos

echo Moving Model
mv ./${FOLDER_NAME}/${FOLDER_NAME}.ts ./app/Models

echo Moving Api Service
mv ./${FOLDER_NAME}/${FOLDER_NAME}Service.ts ./app/Services/Api

echo Moving Repository
mv ./${FOLDER_NAME}/${FOLDER_NAME}Repository.ts ./app/Repositories

echo Moving Controller
mv ./${FOLDER_NAME}/${FOLDER_NAME}Controller.ts ./app/Http/Controllers

echo Moving Validator
mv ./${FOLDER_NAME}/${FOLDER_NAME}Validator.ts ./app/Validators

rm -r ./${FOLDER_NAME}

echo Finished!
