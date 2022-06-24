import { yupResolver } from '@hookform/resolvers/yup'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useLogin } from '~/features/auth/hooks/useLogin'
import { SignIn } from '~/features/ui/components/Header/parts/SignIn'
import { Input } from '~/features/ui/components/Input'
import { LayoutExternal } from '~/features/ui/components/LayoutExternal'

import {
  Container,
  H1,
  P,
  StyledError,
  StyledForm,
  SubmitButton,
} from './styled'

const LogInSchema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  })
  .required()

type LoginInputs = yup.InferType<typeof LogInSchema>

export const LoginPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: yupResolver(LogInSchema),
  })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { mutate } = useLogin()
  const router = useRouter()

  /**
   * Login handler.
   */
  const login = (data: LoginInputs) => {
    console.log(data)
    // Only submit in case of no errors.
    if (!errors.email && !errors.password) {
      // setIsSubmitting(true)
      mutate(data, {
        onSuccess: () => {
          void router.push('/')
        },
        onError: (error) => {
          setSubmitError(error.message)
        },
      })
    }
  }

  return (
    <LayoutExternal>
      <Container>
        <H1>Sign in to Eventio!</H1>
        {submitError ? (
          <StyledError>{submitError}</StyledError>
        ) : (
          <P>Enter your details below</P>
        )}

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <StyledForm onSubmit={handleSubmit(login)} noValidate>
          <Input
            {...register('email')}
            label="Email"
            type="email"
            error={errors?.email?.message}
            name="email"
          />
          <Input
            {...register('password')}
            label="Password"
            type="password"
            error={errors?.password?.message}
            name="password"
          />
          <SignIn position="form" /> {/* Renders only on small screens */}
          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? 'Submitting' : 'Sign In'}
          </SubmitButton>
        </StyledForm>
      </Container>
    </LayoutExternal>
  )
}
