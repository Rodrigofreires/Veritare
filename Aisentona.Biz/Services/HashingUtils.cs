using System.Security.Cryptography;

namespace Aisentona.Biz.Services
{
    public static class HashingUtils
    {
        private const int SaltSize = 16; // Tamanho do salt em bytes
        private const int HashSize = 20; // Tamanho do hash em bytes
        private const int Iterations = 10000; // Número de iterações para o PBKDF2

        public static (byte[] hash, byte[] salt) GeneratePasswordHash(string senha)
        {
            using (var algorithm = new Rfc2898DeriveBytes(senha, SaltSize, Iterations))
            {
                byte[] salt = algorithm.Salt;
                byte[] hash = algorithm.GetBytes(HashSize);
                return (hash, salt);
            }
        }

        public static bool VerifyPassword(string senha, byte[] storedHash, byte[] storedSalt)
        {
            using (var algorithm = new Rfc2898DeriveBytes(senha, storedSalt, Iterations))
            {
                byte[] computedHash = algorithm.GetBytes(HashSize);
                return computedHash.SequenceEqual(storedHash);
            }
        }

    }

}