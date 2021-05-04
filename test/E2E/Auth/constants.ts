const dbUserPayload = {
  name: 'João Lenon',
  email: 'lenonsec7@gmail.com',
  password: '123456',
  role: 'customer',
  status: 'pendent',
}

const storeUserPayload = {
  name: 'João Lenon',
  email: 'lenonsec7@gmail.com',
  password: '123456',
  password_confirmation: '123456',
}

const updateUserPayload = {
  name: 'João Lenon',
  email: 'lenonsec7@gmail.com',
  password: '123456',
  password_confirmation: '123456',
}

const dbTokenPayload = {
  token: '12312313131',
  type: 'email_confirmation',
  expiresIn: `${604800 * 1000}`,
}

export { dbUserPayload, storeUserPayload, updateUserPayload, dbTokenPayload }
