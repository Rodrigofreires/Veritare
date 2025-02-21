using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Enumeradores
{
    public enum Autorizacao
    {
        Administrador = 1,
        EditorChefe = 2,
        EditorBase = 3,
        LeitorPremium = 11,
        LeitorSimples = 5,
        Escritor = 8

    }
}
