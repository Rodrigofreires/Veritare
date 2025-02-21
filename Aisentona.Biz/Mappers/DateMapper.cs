using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Mappers
{
    public class DateMapper
    {
        public static DateTime ParseAndFormatDate(string dateStr)
        {
            if (DateTime.TryParseExact(dateStr, "MM/dd/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
            {
                // Converte a data para o formato do banco de dados
                string formattedDate = parsedDate.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture);
                return DateTime.ParseExact(formattedDate, "yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture);
            }
            else
            {
                throw new FormatException("Formato de data inválido. Use o formato MM/dd/yyyy.");
            }
        }

        // Função auxiliar para ajustar datas
        public DateTime AjustarData(DateTime data)
        {
            return data < new DateTime(1753, 1, 1) ? new DateTime(1753, 1, 1) : data;
        }

    }
}


