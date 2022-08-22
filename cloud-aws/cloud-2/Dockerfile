FROM public.ecr.aws/lambda/nodejs:14


COPY package*.json ./src  ${LAMBDA_TASK_ROOT}

RUN npm ci


CMD ["app.handler"]
