'use client';

import { mailchimp, newsletter } from '@/resources';
import {
  Button,
  Heading,
  Input,
  Text,
  Background,
  Column,
  Textarea,
} from '@once-ui-system/core';
import type { opacity, SpacingToken } from '@once-ui-system/core';
import { useState } from 'react';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const ContactForm: React.FC<React.ComponentProps<typeof Column>> = ({
  ...flex
}) => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const validateEmail = (emailValue: string): boolean => {
    if (emailValue === '') {
      return true;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(emailValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim() === '') {
      setMessageError('Please enter a message.');
    } else {
      setMessageError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submission
    let hasError = false;

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!message.trim()) {
      setMessageError('Please enter a message.');
      hasError = true;
    }

    if (hasError) return;

    setStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: mailchimp.action,
          from_name: 'Portfolio Contact Form',
          replyto: email,
          email: email,
          message: message,
          subject: `New Contact Form Message from ${email}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setResponseMessage('Thank you! Your message has been sent.');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setResponseMessage('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setResponseMessage('Something went wrong. Please try again.');
    }
  };

  if (newsletter.display === false) return null;

  return (
    <Column
      overflow='hidden'
      fillWidth
      padding='xl'
      radius='l'
      marginBottom='m'
      horizontal='center'
      align='center'
      background='surface'
      border='neutral-alpha-weak'
      {...flex}
    >
      <Background
        top='0'
        position='absolute'
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth='xs' horizontal='center'>
        <Heading marginBottom='s' variant='display-strong-xs'>
          {newsletter.title}
        </Heading>
        <Text
          wrap='balance'
          marginBottom='l'
          variant='body-default-l'
          onBackground='neutral-weak'
        >
          {newsletter.description}
        </Text>
      </Column>

      {status === 'success' ? (
        <Column
          fillWidth
          maxWidth={24}
          padding='l'
          horizontal='center'
          align='center'
        >
          <Text variant='body-strong-m' onBackground='brand-strong'>
            {responseMessage}
          </Text>
          <Button
            style={{ marginTop: '1rem' }}
            size='m'
            variant='secondary'
            onClick={() => setStatus('idle')}
          >
            Send another message
          </Button>
        </Column>
      ) : (
        <form
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          onSubmit={handleSubmit}
        >
          <Column fillWidth maxWidth={24} gap='16'>
            <Input
              id='contact-email'
              name='email'
              type='email'
              placeholder='Your email'
              required
              value={email}
              onChange={handleEmailChange}
              errorMessage={emailError}
            />
            <Textarea
              id='contact-message'
              name='message'
              placeholder='Your message'
              required
              value={message}
              onChange={handleMessageChange}
              errorMessage={messageError}
              rows={4}
            />
            {status === 'error' && (
              <Text variant='body-default-s' onBackground='danger-strong'>
                {responseMessage}
              </Text>
            )}
            <Button
              type='submit'
              size='m'
              fillWidth
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </Button>
          </Column>
        </form>
      )}
    </Column>
  );
};

// Keep the old export name for backward compatibility
export const Mailchimp = ContactForm;
