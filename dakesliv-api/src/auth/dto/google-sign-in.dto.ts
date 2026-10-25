import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDto {
  // The ID token (a JWT) the Google sign-in button/SDK hands the client —
  // NOT an access token and NOT an authorization code.
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
