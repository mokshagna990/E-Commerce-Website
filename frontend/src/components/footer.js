import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #2c5282;
  color: white;
  padding: 20px 0;
  margin-top: auto;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterText = styled.p`
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>© 2024 Elegancia. All rights reserved.</FooterText>
        <FooterLinks>
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;